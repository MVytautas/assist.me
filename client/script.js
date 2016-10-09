function ChatController($scope) {
        var socket = io.connect();

        $scope.suggestions = [
            "Demo suggestion",
            "Fake suggestion 2"
        ];
        $scope.roster = [];
        $scope.name = '';
        $scope.text = '';

        socket.on('connect', function () {
          $scope.setName();
        });

        socket.on('question', function (data) {
            $scope.suggestions.length = 0;
            
            data.suggestions.forEach(function(suggestion) {
                $scope.suggestions.push(suggestion);
            });
          
          $scope.$apply();
        });

        socket.on('roster', function (names) {
          $scope.roster = names;
          $scope.$apply();
        });

        $scope.send = function send() {
          console.log('Sending message:', $scope.text);
          socket.emit('message', $scope.text);
          $scope.text = '';
        };

        $scope.setName = function setName() {
          socket.emit('identify', $scope.name);
        };
      }