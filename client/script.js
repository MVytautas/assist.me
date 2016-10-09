function ChatController($scope) {
        var socket = io.connect();

        $scope.suggestions = [];

        $scope.messages = [];

        socket.on('question', function (data) {
            $scope.suggestions.length = 0;
            
            $scope.messages.push({ bot: false, text: data.question });
            
            data.suggestions.forEach(function(suggestion) {
                $scope.suggestions.push(suggestion);
            });
          
          $scope.$apply();
        });

        $scope.send = function send() {
            $scope.messages.push({ bot: true, text: $scope.text });
            console.log('Sending message:', $scope.text);
            socket.emit('answer', $scope.text);
            $scope.text = '';
        };

        $scope.setName = function setName() {
          socket.emit('identify', $scope.name);
        };
      }