Parse.initialize("rp0nxhO9titPELBTGJfz8bi0t66uQdZh4H645Fy2", "k6WPuEpEphSNoiNUrphYJKrbxmzZxrDleM5SGEEi");

app = angular.module('unice', []);

app.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            var $nav = $window.$('#nav');

            if ($window.scrollY > $window.innerHeight - $nav.height()) {
                scope.boolFixed = true;
            } else {
                scope.boolFixed = false;
            }

            scope.$apply();
        });
    };
});

app.filter("sanitize", ['$sce', function($sce) {
    return function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
}]);

app.controller('Pages', function($scope) {
    var Project = Parse.Object.extend('Project');
    var queryInteractive= new Parse.Query(Project).equalTo('section', 'interactive').ascending('order');
    var queryUIUX= new Parse.Query(Project).equalTo('section', 'uiux').ascending('order');

    queryInteractive.find({
        success: function(results) {
            $scope.interactiveProjects = results;
            $scope.$apply();
        },
        error: function(error) {
            logError(error);
        }
    });

    queryUIUX.find({
        success: function(results) {
            $scope.uiuxProjects = results;
            $scope.$apply();
        },
        error: function(error) {
            logError(error);
        }
    });

    $scope.pages = {
        'section': 'home',
        'navTitle': '',
        'page': '',
    };
    $scope.page = null;
    $scope.navOverlay = false;

    $scope.isNavActive = function() {
        /*
            return true if nav is active
        */
        var active = false;

        if ($scope.pages.section == 'home') {
            active = false;
        }  else {
            active = true;
        }

        return active;
    };

    $scope.isInactiveSection = function(section) {
        /*
            returns true if this is not home and the it's not the section
        */
        return $scope.pages.section != 'home' && $scope.pages.section != section;
    };

    $scope.isSection = function(section) {
        /*
            returns true if the section is active
        */
        return $scope.pages.section === section;
    };

    $scope.sectionToggle = function(section, force) {
        /*
            sets the section
        */
        var change = false;

        if ($scope.pages.section != section || force) {
            console.log('change section: ' + section);
            $scope.pages.section = section;
            $scope.pagesHide();

            if ($scope.pages.section != 'home') {
                if ($scope.pages.section == 'uiux') {
                    $scope.pages.navTitle = 'ui / ux';
                } else {
                    $scope.pages.navTitle = section;
                }
            }

            change = true;
        }

        $scope.navOverlayToggle(false);
        return change;
    };

    $scope.getPageSteps = function(page) {
        var stepsQuery = page.get('steps').query().ascending('order');

        stepsQuery.find({
            success: function(results) {
                $scope.pageSteps = results;
                $scope.$apply();
            }
        });
    };

    $scope.isPagesActive = function() {
        /*
            returns true if the pages are active
        */
        var active = false;

        if ($scope.pages.page) {
            active = true;
        }

        return active;
    };

    $scope.isMastheadActive = function() {
        var active = false;

        if ($scope.pages.section == 'about') {
            active = false;
        } else {
            active = !$scope.isPagesActive();
            console.log(active);
        }

        return active;
    };

    $scope.isPage = function(page) {
        /*
            returns true if the page is active
        */
        return $scope.pages.page === page;
    };

    $scope.pageToggle = function(page) {
        /*
            sets the page
        */
        console.log('change page: ' + page.id);
        $scope.pages.page = page.id;
        $scope.page = page;
        $scope.getPageSteps(page);
        $scope.navOverlayToggle(false);
    };

    $scope.pagesHide = function() {
        /*
            hides the pages
        */
        $scope.pages.page = '';
        $scope.page = null;
        $scope.pageSteps = null;
        $scope.navOverlayToggle(false);
    };

    $scope.renderVideo = function(videoId) {
        var html = '';

        if (videoId) {
            html = '<iframe src="https://player.vimeo.com/video/' + videoId + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        }

        return html;
    };

    $scope.navOverlayToggle = function(show) {
        if (typeof show == 'boolean') {
            $scope.navOverlay = show;
        } else {
            $scope.navOverlay = !$scope.navOverlay;
        }
    };
});

function logError(error) {
    console.log('Error: ' + error.code + ' ' + error.message);
}
