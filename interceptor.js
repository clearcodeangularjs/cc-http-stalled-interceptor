/*

    Copyright (C) 2012-2013 by Clearcode <http://clearcode.cc>
    and associates (see AUTHORS).

    This file is part of cc-stalledRequest-interceptor.

    cc-stalledRequest-interceptor is free software: you can redistribute it and/or modify
    it under the terms of the Lesser GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    cc-stalledRequest-interceptor is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with cc-stalledRequest-interceptor.  If not, see <http://www.gnu.org/licenses/>.

*/
      angular.module('cc.http.stalledInterceptor').factory('stalledReqInterceptor', [
        '$q',
        '$rootScope',
        '$timeout',
        function ($q, $rootScope, $timeout) {
            var timeouts = {},
                stalledRequests = [];
            return {
                request: function (config) {
                    console.log('fetching: ', config.url);
                    timeouts[config.url] = $timeout(function () {
                        $rootScope.$broadcast('stalledRequest', config);
                        stalledRequests.push(config.url);
                    }, 5000);
                    return config || $q.when(config);
                },
                response: function (response) {
                    $timeout.cancel(timeouts[response.config.url]);
                    if (stalledRequests.indexOf(response.config.url) !== -1) {
                        $rootScope.$broadcast('stalledRequestComplete', response.config);
                    }
                    return response || $q.when(response);
                },
                responseError: function (rejection) {
                    $timeout.cancel(timeouts[rejection.config.url]);
                    if (stalledRequests.indexOf(response.config.url) !== -1) {
                        $rootScope.$broadcast('stalledRequestError', response.config);
                    }
                    return $q.reject(rejection);
                }
            };
        }
    ]);
