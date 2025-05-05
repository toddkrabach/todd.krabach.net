// MIT License
//
// Copyright (c) 2020 Samuel Nitsche
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
// Modified from the original: https://github.com/pesse/matrix_background

function bginit() {
    var prev = performance.now();
    var chars = [];
    var maxRunningChars = 400;

    var fontSize = 20;
    var alphaMask = 0.1;
    var gridSize = {};

    var requestAnimation;

    function getRandomHexChar() {
        let possibleChars = "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇｸﾍ012345789Z:・.\"=*+-<></>¦｜";
        return possibleChars.charAt(Math.random() * possibleChars.length);
    }

    function sizeCanvas(canvas) {
        canvasSize = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    if (canvas.width !== canvasSize.width || canvas.height !== canvasSize.height) {
            canvas.width = canvasSize.width;
            canvas.height = canvasSize.height;
        }
        gridSize = {
            width: Math.floor(canvasSize.width/(fontSize-6)),
            height: Math.floor(canvasSize.height/(fontSize)),
        };
    }

    function initChar() {
        var char = {
            x: (Math.floor(Math.random()*gridSize.width)),
            y: 0,
            tickTime: Math.random()*50+50,
            lastTick: performance.now(),
            char: getRandomHexChar()
        }
        return char;
    }

    function addBrightness(rgb, brightness) {
        var multiplier = (100+brightness)/100;
        var result = {};
        result.r = rgb.r * multiplier;
        result.g = rgb.g * multiplier;
        result.b = rgb.b * multiplier;
        return result;
    }

    function render(context, time) {
        // Draw a transparent, black rect over everything
        // But not each time
        if (time - prev > 50) {
            context.fillStyle="rgba(13,2,8,"+alphaMask+")";
            context.fillRect(0, 0, canvasSize.width, canvasSize.height);
            prev = time;
        }
            
        // Setup Context Font-Style
        context.font = 'bold 20px Noto Sans JP, Consolas, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        var iOut = 0;
        for ( var i = 0; i < chars.length; i++ ) {
            var c = chars[i];
            if (c.y < gridSize.height) { // If Char is still visible
                chars[iOut++] = c; // put it further-up in the array

                // Add a bit more random brightness to the char
                var color = addBrightness({r: 100, g:200, b:100}, Math.random()*70);
                context.fillStyle = "rgb("+color.r+","+color.g+","+color.b+")";
                context.fillText(c.char, c.x*(fontSize-6), c.y*(fontSize));

                // Only move one y-field down if the randomized TickTime is reached
                if (time - c.lastTick > c.tickTime) {
                    c.y++;
                    c.lastTick = time;
                    // New y-field means new Char, too
                    c.char = getRandomHexChar();
                }
            }
        }
        chars.length = iOut; // Adjust array to new length. 
        //Every visible char is moved to a point before this, the rest is cut off
        
        var newChars = 0;
        while (chars.length < maxRunningChars && newChars < 3) {
            chars.push(initChar());
            newChars++;
        }

        requestAnimation();
    }

    setTimeout(function() {
        var canvas = document.getElementById("background");
        var context;
        if (canvas.getContext) {
            context = canvas.getContext("2d");
        }
        else {
            alert("Browser not able to render 2D canvas");
            return;
        }
        window.addEventListener("resize", function() {
            sizeCanvas(canvas);
        }, false);
        sizeCanvas(canvas);

        requestAnimation = function() {
            requestAnimationFrame(function(time) {
                render(context, time);
            })
        };
        requestAnimation();
    }, 100);
}