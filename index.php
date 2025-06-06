<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>シンプルシューティングゲーム！</title>
    <style>
        body { margin: 0; overflow: hidden; background: black; color: white; font-family: sans-serif; }
        canvas { display: block; margin: 0 auto; background: black; }
        #startBtn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px 30px;
            font-size: 20px;
            background: lime;
            color: black;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }
    </style>
</head>
<body>
<audio id="shootSound" src="shoot.mp3" preload="auto"></audio>
<audio id="explosionSound" src="explosion.mp3" preload="auto"></audio>

<canvas id="gameCanvas" width="600" height="400"></canvas>
<button id="startBtn">Continue</button>
<script src="game.js"></script>
</body>
</html>
