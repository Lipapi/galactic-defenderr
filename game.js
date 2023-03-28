const canvasContainer = document.getElementById('canvas-container');

// Power-up variables
let powerUps = [];
let powerUpSpawnRate = 0.05; // 5% chance of a power-up spawn
let powerUpTypes = ['bulletSpeed', 'playerSpeed'];
let powerUpEffectDuration = 5000; // 5 seconds
let powerUpTimer = 0;
let powerUpEffect = null; // null means no power-up is active

// Power-up icon
let powerUpIcon = new Image();
powerUpIcon.src = 'powerup.png';

function drawPowerUps() {
    for(let i = 0; i < powerUps.length; i++) {
        ctx.drawImage(powerUpIcon, powerUps[i].x, powerUps[i].y, 50, 50);
    }
}

function spawnPowerUp() {
    if(Math.random() < powerUpSpawnRate) {
        let type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        powerUps.push({
            x: Math.random() * canvas.width,
            y: 0,
            type: type
        });
    }
}

function activatePowerUp(type) {
    switch(type) {
        case 'bulletSpeed':
            bulletSpeed = 15; // Increase bullet speed
            break;
        case 'playerSpeed':
            playerSpeed = 10; // Increase player speed
            break;
    }
    powerUpEffect = type;
    powerUpTimer = powerUpEffectDuration;
}

function updatePowerUps() {
    powerUps = powerUps.filter(powerUp => powerUp.y < canvas.height); // Remove power-ups that have gone off-screen
    for(let i = 0; i < powerUps.length; i++) {
        powerUps[i].y += enemySpeed; // Move power-ups down the screen
        if(powerUps[i].y + 50 > playerY && powerUps[i].y < playerY + playerRadius && powerUps[i].x + 50 > playerX && powerUps[i].x < playerX + playerRadius) {
            // Player has collided with power-up
            activatePowerUp(powerUps[i].type);
            powerUps.splice(i, 1); // Remove power-up from array
        }
    }
    // Update power-up effect timer
    if(powerUpEffect !== null) {
        powerUpTimer -= 16; // 16ms = 1 frame
        if(powerUpTimer <= 0) {
            switch(powerUpEffect) {
                case 'bulletSpeed':
                    bulletSpeed = 10; // Reset bullet speed
                    break;
                case 'playerSpeed':
                    playerSpeed = 5; // Reset player speed
                    break;
            }
            powerUpEffect = null;
            powerUpTimer = 0;
        }
    }
}

// Call updatePowerUps() in the update() function


const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');
		
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		let playerX = canvas.width / 2;
		let playerY = canvas.height - 100;
		let playerSpeed = 5;
		let playerRadius = 50;
		
		let bullets = [];
		let bulletSpeed = 10;
		let bulletRadius = 10;
		
		let enemies = [];
		let enemySpeed = 3;
		let enemyRadius = 50;
		
		
		let score = 0;

		// Enemies
		let enemyTypes = ['normal', 'fast', 'big','small'];
		let enemySpeeds = [3, 6, 2];
		let enemyRadii = [50, 30, 70];
		let enemySpawnRate = 50;

	function spawnEnemies() {
    	if(Math.random() < enemySpawnRate / 1000) {
        let type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        let speed = enemySpeeds[Math.floor(Math.random() * enemySpeeds.length)];
        let radius = enemyRadii[Math.floor(Math.random() * enemyRadii.length)];
        enemies.push({
            x: Math.random() * canvas.width,
            y: 0,
            type: type,
            speed: speed,
            radius: radius
        });
    }
}

		
function drawPlayer() {
	ctx.beginPath();
	ctx.arc(playerX, playerY, playerRadius, 0, Math.PI * 2);
	ctx.fillStyle = "#FFFFFF";
	ctx.fill();
	ctx.closePath();
	
  }
  
  function movePlayer(event) {
	switch (event.keyCode) {
	  case 37: // Left arrow key
		if (playerX - playerSpeed >= 0) {
		  playerX -= playerSpeed;
		}
		break;
	  case 38: // Up arrow key
		if (playerY - playerSpeed >= 0) {
		  playerY -= playerSpeed;
		}
		break;
	  case 39: // Right arrow key
		if (playerX + playerSpeed + playerRadius <= canvas.width) {
		  playerX += playerSpeed;
		}
		break;
	  case 40: // Down arrow key
		if (playerY + playerSpeed + playerRadius <= canvas.height) {
		  playerY += playerSpeed;
		}
		break;
	  case 32: // Space bar
		bullets.push({
		  x: playerX,
		  y: playerY,
		  speed: bulletSpeed,
		  radius: bulletRadius,
		  
		});
		break;
	}
  }

		
  function drawBullets() {
	for (let i = 0; i < bullets.length; i++) {
	  ctx.beginPath();
	  ctx.arc(bullets[i].x, bullets[i].y, bullets[i].radius, 0, Math.PI * 2);
	  ctx.fillStyle = '#FF0000';
	  ctx.fill();
	  ctx.closePath();
	}
  }
		
		function moveBullets() {
			for(let i = 0; i < bullets.length; i++) {
				bullets[i].y -= bullets[i].speed;
			}
			bullets = bullets.filter(bullet => bullet.y > 0);
		}
		
		function drawEnemies() {
			for(let i = 0; i < enemies.length; i++) {
				ctx.beginPath();
				ctx.arc(enemies[i].x, enemies[i].y, enemies[i].radius, 0, Math.PI * 2);
				ctx.fillStyle = '#00FF00';
				ctx.fill();
				ctx.closePath();
			}
		}
		

		function moveEnemies() {
			for(let i = 0; i < enemies.length; i++) {
				enemies[i].y += enemies[i].speed;
			}
			enemies = enemies.filter(enemy => enemy.y < canvas.height);
		}


		function detectCollisions() {
			for (let i = 0; i < bullets.length; i++) {
			  for (let j = 0; j < enemies.length; j++) {
				const dx = bullets[i].x - enemies[j].x;
				const dy = bullets[i].y - enemies[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < bullets[i].radius + enemies[j].radius) {
				  bullets.splice(i, 1);
				  enemies.splice(j, 1);
				  score++;
		  
				  crashSound.currentTime = 0; // reset the audio to start at the beginning
				  crashSound.play();
		  
				  break;
				}
			  }
			}
		  
			for (let i = 0; i < enemies.length; i++) {
			  const dx = playerX - enemies[i].x;
			  const dy = playerY - enemies[i].y;
			  const distance = Math.sqrt(dx * dx + dy * dy);
			  if (distance < playerRadius + enemies[i].radius) {
				alert(`Game over! Your score is ${score}`);
		  
				window.location.href = 'index.html';
			  }
			}
		  }
		  
		
		function drawScore() {
			ctx.font = 'bold 28px Arial';
			ctx.fillStyle = '#FFFFFF';
			ctx.fillText(`Score: ${score}`, 20, 40);
		}
		
		function update() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawPlayer();
			drawBullets();
			moveBullets();
			drawEnemies();
			moveEnemies();
			spawnEnemies();
			detectCollisions();
			drawScore();
			requestAnimationFrame(update);
		}
		
		document.addEventListener('keydown', movePlayer);
		
		update();



		function playBulletSound() {
			const bulletSound = document.getElementById("bulletSound");
			bulletSound.currentTime = 0;
			bulletSound.play();
		  }

		  document.addEventListener('keyup', function(event) {
			if (event.code === 'Space') {
			  playBulletSound();
			  bullets.push({
				x: player.x + player.width / 2,
				y: player.y - 10,
				speed: 10,
				radius: 5
			  });
			}
		  });  

		  function playCrashSound() {
			const crashSound = document.getElementById("crashSound");
			crashSound.currentTime = 0;
			crashSound.play();
		  }

		  function toggleMute() {
			var music = document.getElementById("backgroundMusic");
			var button = document.getElementById("mute-button");
		  
			if (music.paused) {
			  music.play();
			  button.classList.remove("muted");
			} else {
			  music.pause();
			  button.classList.add("muted");
			}
		  }


		  var isMuted = false;

		  function toggleMute() {
			  var backgroundMusic = document.getElementById("backgroundMusic");
			  var bulletSound = document.getElementById("bulletSound");
			  var crashSound = document.getElementById("crashSound");
		  
			  isMuted = !isMuted;
			  backgroundMusic.muted = isMuted;
			  bulletSound.muted = isMuted;
			  crashSound.muted = isMuted;
		  }

		  
		  window.addEventListener("load", function() {
			var backgroundMusic = document.getElementById("backgroundMusic");
			backgroundMusic.play();
		  });
		  


		
		  