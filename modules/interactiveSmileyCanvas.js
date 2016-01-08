/**
 * Created by liene on 31/12/2015.
 */

var interactiveSmileyCanvasModule = (function () {

    var c = document.getElementById("smileyCanvas");
    var ctx = c.getContext("2d");

    var sadRGB = [152, 30, 30];
    var happyRGB = [70, 161, 73];

    var drawSmileyCanvas = function (moodValue) {
        ctx.clearRect(0, 0, c.width, c.height); //canvas clearen voor nieuw frame

        var mood = moodValue;
        giveMoodWord();
        //offset positie mond
        var offsetX = c.width / 5;
        var offSetY = c.width / 2.14 + (mood / (c.width / 6));

        //variabelen voor beziercurve (= mond)
        var SPx = offsetX;
        var SPy = offSetY + c.width / 3 - (mood * (c.width / 376.66));
        var H1x = offsetX;
        var H1y = offSetY + (mood * (c.width / 250));
        var H2x = offsetX + ((c.width / 300) * 180);
        var H2y = offSetY + (mood * (c.width / 250));
        var EPx = offsetX + (c.width / 1.666);
        var EPy = offSetY + (c.width / 3) - (mood * (c.width / 376.66));

        //hoofd
        ctx.lineWidth = c.width / 60;
        ctx.beginPath();
        ctx.arc((c.width / 2), (c.width / 2), (c.width / 2.07), 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(" + moodColor(0) + "," + moodColor(1) + "," + moodColor(2) + ")";
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();

        //mond

        ctx.lineWidth = c.width / 30;
        ctx.beginPath();
        ctx.moveTo(SPx, SPy);
        ctx.bezierCurveTo(H1x, H1y, H2x, H2y, EPx, EPy);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.lineCap = "round";

        //oog links

        ctx.lineWidth = c.width / 60;
        ctx.beginPath();
        ctx.arc(c.width / 3, c.width / 3, c.width / 15, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.stroke();

        //oog rechts
        ctx.beginPath();
        ctx.arc(c.width / 3 * 2, c.width / 3, c.width / 15, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.stroke();
    };
    var moodColor = function (c) {
        //c: R = 0, G = 1, B = 2

        if (sadRGB[c] > happyRGB[c]) {
            return Math.round(sadRGB[c] - ((sadRGB[c] - happyRGB[c]) * ($scope.sliderValue / 100)));
        }
        else {
            return Math.round(sadRGB[c] + ((happyRGB[c] - sadRGB[c]) * ($scope.sliderValue / 100)));
        }

    };

    var moodwords = ["horrible", "really bad", "bad", "okay", "good", "really good", "excellent"];

    var giveMoodWord = function () {
        if ($scope.sliderValue < 5) {
            $scope.moodWord = moodwords[0];
        }
        else if ($scope.sliderValue < 25) {
            $scope.moodWord = moodwords[1];
        }
        else if ($scope.sliderValue < 40) {
            $scope.moodWord = moodwords[2];
        }
        else if ($scope.sliderValue < 60) {
            $scope.moodWord = moodwords[3];
        }
        else if ($scope.sliderValue < 75) {
            $scope.moodWord = moodwords[4];
        }
        else if ($scope.sliderValue < 95) {
            $scope.moodWord = moodwords[5];
        }
        else {
            $scope.moodWord = moodwords[6];
        }
    };

    return
    {

    }

})();