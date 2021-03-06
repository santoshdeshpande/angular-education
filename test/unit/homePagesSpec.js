/*global describe, beforeEach, afterEach, it, inject, expect, spyOn, videojs*/

describe('Home Pages', function() {

  beforeEach(module('app.homePages'));

  describe('Factories', function() {

    var $httpBackend, API_BASE;

    beforeEach(inject(function(_$httpBackend_, _API_BASE_) {
      $httpBackend = _$httpBackend_;
      API_BASE = _API_BASE_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.verifyNoOutstandingExpectation();
    });

    describe('Videos Factory', function() {

      var videos;

      beforeEach(inject(function(_videos_) {
        videos = _videos_;
      }));

      it('should return an array of objects when the all get called', function() {
        var ret;
        $httpBackend.whenGET(API_BASE + '/videos').respond([]);
        videos.all().then(function(data) {
          ret = data;
        });
        $httpBackend.flush();
        expect(ret.length).toBeDefined();
      });

      it('should return an objects when getById is called', function() {
        var ret, obj = {id: 1};
        $httpBackend.whenGET(API_BASE + '/videos/' + obj.id).respond(obj);
        videos.getById(obj.id).then(function(data) {
          ret = data;
        });
        $httpBackend.flush();
        expect(ret.id).toEqual(1);
      });

    });

    describe('Problems Factory', function() {

      var problems, ret;

      beforeEach(inject(function(_problems_) {
        problems = _problems_;
      }));

      it('should return an array of objects when the all get called', function() {
        $httpBackend.whenGET(API_BASE + '/problems').respond([]);
        problems.all().then(function(data) {
          ret = data;
        });
        $httpBackend.flush();
        expect(ret.length).toBeDefined();
      });

      it('should return an objects when getById is called', function() {
        var obj = {id: 1};
        $httpBackend.whenGET(API_BASE + '/problems/' + obj.id).respond(obj);
        problems.getById(obj.id).then(function(data) {
          ret = data;
        });
        $httpBackend.flush();
        expect(ret.id).toEqual(1);
      });

      // Todo: Move to Question Factory
      /*
      it('should return an objects when answer is posted', function() {
        var obj = {id: 1}, ans = !!Math.floor(Math.random() * 2);
        $httpBackend.whenPOST(API_BASE + '/problems/' + obj.id).respond({isCorrect: ans});
        problems.answer(obj.id, {}).then(function(data) {
          ret = data.isCorrect;
        });
        $httpBackend.flush();
        expect(ret).toEqual(ans);
      });
      */

    });

    describe('Question Factory', function() {

      var question;

      beforeEach(inject(function(_question_) {
        question = _question_;
      }));

      describe('current', function() {

        it('should return null', function() {
          expect(question.current()).toBeNull();
        });

        it('should return the first item initially if non-empty', function() {
          question.set([1, 2, 3]);
          expect(question.current()).toEqual(1);
        });

      });

      describe('next', function() {

        it('should return the next item', function() {
          question.set([1, 2, 3]);
          question.next();
          expect(question.current()).toEqual(2);
        });

        it('should return the next, next item', function() {
          question.set([1, 2, 3]);
          question.next();
          question.next();
          expect(question.current()).toEqual(3);
        });

        it('shouldn\'t get out of bound', function() {
          question.set([1]);
          question.next();
          expect(question.current()).toEqual(1);
        });

      });

      describe('position', function() {

        it('should return 0 initially if empty', function() {
          expect(question.position()).toEqual(0);
        });

        it('should return 1 initially if non-empty', function() {
          question.set([1]);
          expect(question.position()).toEqual(1);
        });

      });

      describe('total', function() {

        it('should return 0 initially if empty', function() {
          expect(question.total()).toEqual(0);
        });

        it('should return 1 initially if non-empty', function() {
          var data = [1, 2, 3];
          question.set(data);
          expect(question.total()).toEqual(data.length);
        });

      });

    });

  });

  describe('Directives', function() {

    // TODO: Fix the videojs issue
    describe('videoJs Directive', function() {
      var element, $scope, $window;

      beforeEach(inject(function(_$compile_, _$rootScope_, _$window_) {
        $window = _$window_;
        $scope = _$rootScope_.$new();
        element = angular.element('<video video-js class="video-js vjs-default-skin"></video>');
        _$compile_(element)($scope);
        $scope.$apply();
      }));

      afterEach(function() {
        $scope.$destroy();
      });

      it('should add a ID to the element', function() {
        $scope.id = 7;
        $scope.url = 'http://vjs.zencdn.net/v/oceans.mp4';
        $scope.$apply();
        expect(element.attr('id')).toEqual('video-js' + $scope.id + '_html5_api');
      });

      // TODO: Find a way to do this properly
      it('should pass the ID and the html5 config for non youtube video', function() {
        /*
         $scope.id = 7;
         $scope.url = 'http://vjs.zencdn.net/v/oceans.mp4';
         spyOn(videojs, 'constructor').andCallThrough();
         $scope.$apply();
         expect(videojs.constructor).toHaveBeenCalledWith();
         */
      });

      it('should fire ready for non youtube video', function() {
        $scope.id = 7;
        $scope.url = 'http://vjs.zencdn.net/v/oceans.mp4';
        spyOn(videojs.Player.prototype, 'ready').andCallThrough();
        $scope.$apply();
        expect(videojs.Player.prototype.ready).toHaveBeenCalled();
      });

      // TODO: Find a way to do this properly
      it('should pass the ID and the youtube config for youtube video', function() {
        /*
         $scope.id = 7;
         $scope.url = 'http://www.youtube.com/watch?v=vO_Ie3kMXbY';
         spyOn(window, 'videojs').andCallThrough();
         $scope.$apply();
         var config = {
         techOrder: ['youtube'],
         src: $scope.url,
         controls: true,
         preload: 'auto',
         autoplay: false,
         ytcontrols: false,
         width: '100%',
         height: 0
         };
         expect(window.videojs).toHaveBeenCalledWith('video-js' + $scope.id, config);
         */
      });

    });

    describe('tooltip Directive', function() {
      var element, $scope;

      beforeEach(inject(function(_$compile_, _$rootScope_) {
        $scope = _$rootScope_.$new();
        element = angular.element('<a tooltip href="#" title="Test"></a>');
        _$compile_(element)($scope);
        $scope.$apply();
      }));

      it('should contain contain bs.tooltip', function() {
        expect(angular.isObject(element.data('bs.tooltip'))).toBeTruthy();
      });

    });

  });

  describe('Controllers', function() {

    var ctrl, $scope, deferred, videos, problems, questions, question;

    beforeEach(inject(function(_$q_, _videos_, _problems_, _questions_, _question_) {
      deferred = _$q_.defer();
      videos = _videos_;
      problems = _problems_;
      questions = _questions_;
      question = _question_;
      spyOn(videos, 'all').andReturn(deferred.promise);
      spyOn(videos, 'getById').andReturn(deferred.promise);
      spyOn(problems, 'all').andReturn(deferred.promise);
      spyOn(problems, 'getById').andReturn(deferred.promise);
      spyOn(questions, 'answer').andReturn(deferred.promise);
    }));

    describe('Home Controller', function() {

      beforeEach(inject(function(_$controller_, _$rootScope_) {
        $scope = _$rootScope_.$new();
        ctrl = _$controller_('HomeCtrl', {
          $scope: $scope
        });
      }));

      describe('Initialization', function() {

        it('should instantiate videos to null', function() {
          expect($scope.videos).toBeNull();
        });

        it('should call the all function in factory', function() {
          expect(videos.all).toHaveBeenCalled();
        });

      });

      describe('After factory resolved', function() {

        it('should update the videos with content from factory', function() {
          var videos = [1, 2, 3];
          deferred.resolve(videos);
          $scope.$apply();
          expect($scope.videos).toEqual(videos);
        });

      });

    });

    describe('Video Controller', function() {
      // Generate a random id between 0~100
      var routeParamId = (Math.random() * 100).toFixed(0);

      beforeEach(inject(function(_$controller_, _$rootScope_) {
        $scope = _$rootScope_.$new();
        ctrl = _$controller_('VideoCtrl', {
          $scope: $scope,
          $routeParams: {
            id: routeParamId
          }
        });
      }));

      describe('Initialization', function() {

        it('should instantiate id to the given routeParam id', function() {
          expect($scope.id).toEqual(routeParamId);
        });

        it('should instantiate title to null', function() {
          expect($scope.title).toBeNull();
        });

        it('should instantiate url to null', function() {
          expect($scope.url).toBeNull();
        });

        it('should instantiate isYouTube to false', function() {
          expect($scope.isYouTube).toBeFalsy();
        });

        it('should call the getById function in factory', function() {
          expect(videos.getById).toHaveBeenCalledWith(routeParamId);
        });

      });

      describe('After factory resolved', function() {

        it('should update the title with content from factory', function() {
          var title = 'awesome video';
          deferred.resolve({title: title});
          $scope.$apply();
          expect($scope.title).toEqual(title);
        });

        it('should update the url with content from factory', function() {
          var url = 'http://example.com/superman.mp4';
          deferred.resolve({url: url});
          $scope.$apply();
          expect($scope.url).toEqual(url);
        });

        it('should set isYouTube to true for YouTube urls', function() {
          var url = 'http://www.youtube.com/watch?v=vO_Ie3kMXbY';
          deferred.resolve({url: url});
          $scope.$apply();
          expect($scope.isYouTube).toBeTruthy();
        });

        it('should set isYouTube to false for non YouTube urls', function() {
          var url = 'http://example.com/superman.mp4';
          deferred.resolve({url: url});
          $scope.$apply();
          expect($scope.isYouTube).toBeFalsy();
        });


      });

    });

    describe('Problem List Controller', function() {

      beforeEach(inject(function(_$controller_, _$rootScope_) {
        $scope = _$rootScope_.$new();
        ctrl = _$controller_('ProblemListCtrl', {
          $scope: $scope
        });
      }));

      describe('Initialization', function() {

        it('should instantiate problems to null', function() {
          expect($scope.problems).toBeNull();
        });

        it('should call the all function in factory', function() {
          expect(problems.all).toHaveBeenCalled();
        });

      });

      describe('After factory resolved', function() {

        it('should update the problems with content from factory', function() {
          var problems = [1, 2, 3];
          deferred.resolve(problems);
          $scope.$apply();
          expect($scope.problems).toEqual(problems);
        });

      });

    });

    describe('Problem Controller', function() {
      // Generate a random id between 0~100
      var routeParamId = (Math.random() * 100).toFixed(0);

      beforeEach(inject(function(_$controller_, _$rootScope_) {
        $scope = _$rootScope_.$new();
        ctrl = _$controller_('ProblemCtrl', {
          $scope: $scope,
          $routeParams: {
            id: routeParamId
          }
        });
      }));

      describe('Initialization', function() {

        it('should instantiate id to the given routeParam id', function() {
          expect($scope.id).toEqual(routeParamId);
        });

        it('should instantiate title to null', function() {
          expect($scope.title).toBeNull();
        });

        it('should call the getById function in factory', function() {
          expect(problems.getById).toHaveBeenCalledWith(routeParamId);
        });

      });

      describe('After factory resolved', function() {

        it('should update the title with content from factory', function() {
          var title = 'awesome video';
          deferred.resolve({title: title, questions: []});
          $scope.$apply();
          expect($scope.title).toEqual(title);
        });

        it('should call the set function on question factory', function() {
          var data = [1, 2, 3];
          spyOn(question, 'set').andCallThrough();
          deferred.resolve({questions: data});
          $scope.$apply();
          expect(question.set).toHaveBeenCalledWith(data);
        });

        it('should invoke the callback after the data has been set', function() {
          var data = [1, 2, 3];
          deferred.resolve({questions: data});
          $scope.$apply();
          expect($scope.question).toEqual(data[0]);
          expect($scope.total).toEqual(data.length);
          expect($scope.position).toEqual(1);
        });

      });

      describe('Methods', function() {

        describe('currentClass', function() {

          it('should return warning on undefined', function() {
            var question = {};
            expect($scope.currentClass('test', question)).toEqual('test-warning');
          });

          it('should return warning on undefined', function() {
            $scope.question = {};
            expect($scope.currentClass('test')).toEqual('test-warning');
          });

          it('should return success on true', function() {
            var question = {isCorrect: true};
            expect($scope.currentClass('test', question)).toEqual('test-success');
          });

          it('should return success on true', function() {
            $scope.question = {isCorrect: true};
            expect($scope.currentClass('test')).toEqual('test-success');
          });

          it('should return danger on false', function() {
            var question = {isCorrect: false};
            expect($scope.currentClass('test', question)).toEqual('test-danger');
          });

          it('should return danger on false', function() {
            $scope.question = {isCorrect: false};
            expect($scope.currentClass('test')).toEqual('test-danger');
          });

        });

        describe('next', function() {

          it('should invoke the next function on question', function() {
            spyOn(question, 'next').andCallThrough();
            $scope.next();
            expect(question.next).toHaveBeenCalled();
          });

        });

        describe('submit', function() {

          var answer = 6;

          it('should expect isAnswered to true', function() {
            $scope.question = {answer: answer};
            $scope.submit();
            expect($scope.isAnswered).toBeTruthy();
          });

          it('should expect canProceed to true', function() {
            $scope.question = {answer: answer};
            $scope.submit();
            expect($scope.canProceed).toBeTruthy();
          });

          it('should invoke the answer function on problems', function() {
            $scope.question = {id: 5, answer: answer};
            $scope.submit();
            expect(questions.answer).toHaveBeenCalledWith($scope.question);
          });

          it('shouldn\'t invoke the answer function on problems if answer is not defined', function() {
            $scope.question = {};
            $scope.submit();
            expect(questions.answer).not.toHaveBeenCalled();
          });

          // TODO: Fix this
          /*
           it('should invoke the success callback on successful request', function() {
           var ans = !!Math.floor(Math.random() * 2);
           $scope.question = {id: 5, answer: answer};
           $scope.$apply();
           deferred.resolve({isCorrect: ans});
           $scope.submit();
           expect($scope.question.isCorrect).toEqual(ans);
           expect($scope.canProceed).toBeFalsy();
           });
           */

        });

      });

    });

  });

});
