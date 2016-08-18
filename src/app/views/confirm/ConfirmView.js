(function() {
  'use strict';
angular.module('civic.confirm')
  .controller('ConfirmViewController', ConfirmViewController)
  .config(ConfirmView);

  // @ngInject
  function ConfirmView($stateProvider) {
    $stateProvider
      .state('confirm', {
        url: '/confirm',
        controller: 'ConfirmViewController',
        templateUrl: 'app/views/confirm/confirm.tpl.html',
        resolve: {
          'CurrentUser': 'CurrentUser',
          'user': function (CurrentUser) {
            return CurrentUser.get();
          }
        },
        data: {
          titleExp: '"Confirm CIViC Details"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function ConfirmViewController($state, $scope, Security, user) {
    console.log('ConfirmViewController loaded.');
    var vm = $scope.vm = {};

    vm.user = user;
    vm.userEdit = angular.copy(user);
    vm.currentUser = Security.currentUser;

    vm.submitSuccess = false;
    vm.submitFail = false;

    vm.userEditFields = [
      {
        template:'<h3 class="form-subheader">Profile Details</h3>'
      },
      {
        key: 'name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Name',
          minLength: 8,
          value: 'vm.userEdit.name',
          helpText: 'Name'
        }
      },
      {
        key: 'username',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'User Name',
          minLength: 8,
          value: 'vm.userEdit.user',
          helpText: 'Username'
        }
      },
      {
        key: 'email',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Email Address',
          minLength: 5,
          value: 'vm.userEdit.email',
          helpText: 'Email address will be used for sending CIViC notifications, news, and updates. CIViC will never share your email address.'
        }
      },
      {
        key: 'area_of_expertise',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Areas of Expertise',
          options: [
            { value: null, label: 'Please select an Area of Expertise' },
            { value: 'Patient Advocate', label: 'Patient Advocate'},
            { value: 'Clinical Scientist', label: 'Clinical Scientist' },
            { value: 'Research Scientist', label: 'Research Scientist' }
          ],
          valueProp: 'value',
          labelProp: 'label',
          value: 'vm.userEdit.area_of_expertise',
          helpText: 'Area of Expertise'
        }
      },
      {
        key: 'orcid',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'ORCID',
          minLength: 5,
          value: 'vm.userEdit.orcid',
          helpText: 'Your Open Research and Contributor ID.'
        }
      },
      {
        key: 'url',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Personal Website',
          minLength: 5,
          value: 'vm.userEdit.url',
          helpText: 'Your personal website/blog.'
        }
      },
      {
        key: 'bio',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          label: 'Biography',
          rows: 4,
          value: 'vm.userEdit.bio',
          helpText: 'A short bio describing your interests, accomplishments, associations, and/or anything else about yourself you would like to share with the CIViC community.'
        }
      },
      {
        template:'<h3 class="form-subheader">Social Media</h3>'
      },
      {
        key: 'twitter_handle',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Twitter Handle',
          minLength: 5,
          value: 'vm.userEdit.twitter_handle',
          helpText: 'Your Twitter handle, displayed on your profile page and user cards.'
        }
      },
      {
        key: 'facebook_profile',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Facebook Profile',
          minLength: 5,
          value: 'vm.userEdit.facebook_profile',
          helpText: 'A link to your Facebook profile, displayed on your profile page and user cards.'
        }
      },
      {
        key: 'linkedin_profile',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'LinkedIn Profile',
          minLength: 5,
          value: 'vm.userEdit.linkedin_profile',
          helpText: 'A link to your LinkedIn profile, displayed on your profile page and user cards.'
        }
      },
      {
        template:'<h3 class="form-subheader">Licensing Terms</h3>'
      },
      {
        template: '<p>All curated content in CIViC is licened under the Creative Commons CC0 license, which waives all copyrights so that others may freely build upon, enhance and reuse the works for any purposes without restriction under copyright or database law. Please review the terms of this license and indicate your agreement to these terms by checking the box below. Then submit this form to update your profile and licencing terms agreement.</p>'
      },
      {
        key: 'accepted_license',
        type: 'horizontalCheckbox',
        templateOptions: {
          label: 'I have read the Creative Commons CC0 license and understand that all of my contributions to CIViC will be made available under this license.',
          required: true
        }
      }
    ];

    vm.saveProfile = function(userEdit) {

      Users.update(userEdit)
        .then(function(response) {
          console.log('updated user successfully');
          vm.submitSuccess = true;
          vm.user = Security.reloadCurrentUser();
        })
        .catch(function() {
          console.error('update user error!');
          vm.submitFail = true;
        });

    };

  }
})();
