//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2014 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
//++

angular.module('openproject.workPackages.tabs')

.directive('userActivity', ['$uiViewScroll', 'I18n', 'PathHelper', 'ActivityService', function($uiViewScroll, I18n, PathHelper, ActivityService) {
  return {
    restrict: 'E',
    replace: true,
    require: '^?exclusiveEdit',
    templateUrl: '/templates/work_packages/tabs/_user_activity.html',
    scope: {
      activity: '=',
      activityNo: '=',
      inputElementId: '='
    },
    link: function(scope, element, attrs, exclusiveEditController) {
      exclusiveEditController.addEditable(scope);

      scope.I18n = I18n;
      scope.userPath = PathHelper.staticUserPath;
      scope.inEdit = false;
      scope.inFocus = false;

      scope.activity.links.user.fetch().then(function(user) {
        scope.userId = user.props.id;
        scope.userName = user.props.name;
        scope.userAvatar = user.props.avatar;
      });

      scope.editComment = function() {
        scope.inEdit = true;
        exclusiveEditController.gotEditable(scope);
      };

      scope.cancelEdit = function() {
        scope.inEdit = false;
      };

      scope.quoteComment = function() {
        var elem = angular.element('#' + scope.inputElementId);
        elem.val(quotedText(scope.activity.props.rawComment));
        $uiViewScroll(elem);
      };

      scope.updateComment = function(comment) {
        var comment = angular.element('#edit-comment-text').val();
        ActivityService.updateComment(scope.activity.props.id, comment).then(function(activity){
          scope.$emit('workPackageRefreshRequired', '');
          scope.inEdit = false;
        });
      };

      scope.showActions = function() {
        scope.inFocus = true;
      };

      scope.hideActions = function() {
        scope.inFocus = false;
      };

      function quotedText(rawComment) {
        quoted = rawComment.split("\n")
          .map(function(line){ return "\n> " + line; })
          .join('');
        return scope.userName + " wrote:" + quoted;
      }
    }
  };
}]);
