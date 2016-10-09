function ChatController($scope) {
    var socket = io.connect();

    $scope.suggestions = [];

    $scope.users = {
        "1131979180217385": { name: "Deividas Karžinauskas", messages: [], suggestions: [], img: "14610699_1277531758943815_1246537132_n" },
        "1066750830110277": { name: "Simonas Žilinskas", messages: [], suggestions: [], img: "14593445_1277531812277143_1340981473_n" },
        "1215465971852445": { name: "Vytautas Mikalainis", messages: [], suggestions: [], img: "14642600_1277531882277136_1520520873_n" }
    };
    $scope.activeUser = "1131979180217385";

    $scope.messages = [];

    socket.on('question', function (response) {
        $scope.users[$scope.activeUser].suggestions.length = 0;
        
        if ($scope.users[response.sender] === undefined) {
            $scope.users[response.sender] = { messages: [], suggestions: [] };
        }
        
        $scope.users[response.sender].messages.push({ bot: false, text: response.data.question });
        $scope.activeUser = response.sender;
        
        $scope.messages.push({ bot: false, text: response.data.question });
        
        response.data.suggestions.forEach(function(suggestion) {
            $scope.users[$scope.activeUser].suggestions.push(suggestion);
        });
      
      $scope.$apply();
    });
    
    // socket.on('conversations', function() {
        
    // });

    $scope.send = function send(message) {
        $scope.users[$scope.activeUser].messages.push({ bot: true, text: message });
        // console.log('Sending message:', $scope.text);
        
        var messages = $scope.users[$scope.activeUser].messages.slice();
        var question = undefined;
        
        $scope.users[$scope.activeUser].messages.forEach(function(item, index) {
            if (item.bot === false) { question = item.text; }
        });

        var answer = {
            "text": message,
            "user": $scope.activeUser,
        };
        
        if (question !== undefined) {
            answer.question = question;
        }
        
        socket.emit('answer', answer);
        $scope.text = '';
    };

    $scope.changeActive = function(userId) {
        $scope.activeUser = userId;
    }
    
    $scope.useSuggestion = function(suggestion) {
        $scope.text = suggestion;
    }
}

angular.module('myApp', ['ngAnimate', 'ngTouch', 'ui.bootstrap']);
angular.module('myApp').controller('mainCtrl', ChatController);