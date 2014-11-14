// Include in index.html so that app level exceptions are handled.
// Exclude from testRunners which should run exactly what they want
(function() {
    'use strict';

    angular
        .module('simpleRestApp')
        .provider('exceptionConfig', exceptionConfigProvider)
        .config(exceptionConfig);

    // Must configure the service and set its
    // events via the exceptionConfigProvider
    function exceptionConfigProvider() {
        /* jshint validthis:true */
        this.config = {
            // These are the properties we need to set
            //appErrorPrefix: ''
        };

        this.$get = function() {
            return {
                config: this.config
            };
        };
    }

    exceptionConfig.$inject = ['$provide'];

    // Configure by setting an optional string value for appErrorPrefix.
    // Accessible via config.appErrorPrefix (via config value).
    function exceptionConfig($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate', 'exceptionConfig', 'logger'];

    // Extend the $exceptionHandler service to also log
    function extendExceptionHandler($delegate, exceptionConfig, logger) {
        var appErrorPrefix = exceptionConfig.config.appErrorPrefix || '';
        return function(exception, cause) {
            $delegate(exception, cause);
            var errorData = {exception: exception, cause: cause};
            var msg = appErrorPrefix + exception.message;
            /**
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             *
             * @example
             *     throw { message: 'error message we added' };
             *
             */
            logger.error(msg, errorData);
        };
    }
})();