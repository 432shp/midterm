document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ゲーム切り替え機能 =====
    const gameMenuBtns = document.querySelectorAll('.game-menu-btn');
    const gameSections = document.querySelectorAll('.game-section');
    
    gameMenuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetGame = btn.dataset.game;
            
            // メニューボタンのアクティブ状態を切り替え
            gameMenuBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // ゲームセクションを切り替え
            gameSections.forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(`${targetGame}-game`).style.display = 'block';
        });
    });
    
    
    // ===== 1. タイピングゲーム =====
    (function() {
        const words = {
            easy: ['cat', 'dog', 'sun', 'pen', 'cup', 'hat', 'egg', 'box', 'bus', 'car'],
            normal: ['apple', 'banana', 'orange', 'grape', 'melon', 'lemon', 'peach', 'mango', 'cherry', 'berry'],
            hard: ['javascript', 'programming', 'computer', 'keyboard', 'algorithm', 'database', 'function', 'variable', 'development', 'technology']
        };

        let currentLevel = 'easy';
        let currentWord = '';
        let correctCount = 0;
        let missCount = 0;
        let timeCount = 0;
        let timerInterval = null;
        let isPlaying = false;
        let wordCount = 0;
        const maxWords = 10;

        const targetWordEl = document.getElementById('typing-targetWord');
        const typingInput = document.getElementById('typing-input');
        const startBtn = document.getElementById('typing-start');
        const resetBtn = document.getElementById('typing-reset');
        const timeEl = document.getElementById('typing-time');
        const correctEl = document.getElementById('typing-correct');
        const missEl = document.getElementById('typing-miss');
        const resultEl = document.getElementById('typing-result');
        const resultStatsEl = document.getElementById('typing-resultStats');
        const levelBtns = document.querySelectorAll('#typing-game .level-btn');

        levelBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!isPlaying) {
                    levelBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentLevel = btn.dataset.level;
                }
            });
        });

        startBtn.addEventListener('click', startGame);
        resetBtn.addEventListener('click', resetGame);
        typingInput.addEventListener('input', checkInput);

        function startGame() {
            if (isPlaying) return;
            
            isPlaying = true;
            wordCount = 0;
            correctCount = 0;
            missCount = 0;
            timeCount = 0;
            
            typingInput.disabled = false;
            typingInput.value = '';
            typingInput.focus();
            resultEl.style.display = 'none';
            
            startBtn.disabled = true;
            levelBtns.forEach(btn => btn.disabled = true);
            
            updateStats();
            setNewWord();
            
            timerInterval = setInterval(() => {
                timeCount++;
                timeEl.textContent = timeCount;
            }, 1000);
        }

        function setNewWord() {
            const wordList = words[currentLevel];
            currentWord = wordList[Math.floor(Math.random() * wordList.length)];
            targetWordEl.innerHTML = currentWord;
            typingInput.value = '';
        }

        function checkInput() {
            const inputValue = typingInput.value;
            let displayHTML = '';
            let isCorrect = true;

            for (let i = 0; i < currentWord.length; i++) {
                if (i < inputValue.length) {
                    if (inputValue[i] === currentWord[i]) {
                        displayHTML += `<span class="correct">${currentWord[i]}</span>`;
                    } else {
                        displayHTML += `<span class="incorrect">${currentWord[i]}</span>`;
                        isCorrect = false;
                    }
                } else {
                    displayHTML += currentWord[i];
                }
            }

            targetWordEl.innerHTML = displayHTML;

            if (inputValue.length === currentWord.length) {
                if (isCorrect) {
                    correctCount++;
                    wordCount++;
                    
                    if (wordCount >= maxWords) {
                        endGame();
                    } else {
                        setTimeout(setNewWord, 300);
                    }
                } else {
                    missCount++;
                    typingInput.value = '';
                    targetWordEl.innerHTML = currentWord;
                }
                updateStats();
            }
        }

        function updateStats() {
            correctEl.textContent = correctCount;
            missEl.textContent = missCount;
        }

        function endGame() {
            isPlaying = false;
            clearInterval(timerInterval);
            typingInput.disabled = true;
            startBtn.disabled = false;
            levelBtns.forEach(btn => btn.disabled = false);

            const accuracy = ((correctCount / (correctCount + missCount)) * 100).toFixed(1);
            const wpm = Math.round((correctCount * 60) / timeCount);

            resultStatsEl.innerHTML = `
                <div class="result-item"><strong>正解数:</strong> ${correctCount}</div>
                <div class="result-item"><strong>ミス数:</strong> ${missCount}</div>
                <div class="result-item"><strong>所要時間:</strong> ${timeCount}秒</div>
                <div class="result-item"><strong>正確性:</strong> ${accuracy}%</div>
                <div class="result-item"><strong>速度:</strong> ${wpm} WPM</div>
                <div class="result-item"><strong>レベル:</strong> ${currentLevel === 'easy' ? '簡単' : currentLevel === 'normal' ? '普通' : '難しい'}</div>
            `;
            resultEl.style.display = 'block';
        }

        function resetGame() {
            isPlaying = false;
            clearInterval(timerInterval);
            
            correctCount = 0;
            missCount = 0;
            timeCount = 0;
            wordCount = 0;
            
            typingInput.value = '';
            typingInput.disabled = true;
            targetWordEl.textContent = 'スタートを押してください';
            resultEl.style.display = 'none';
            
            startBtn.disabled = false;
            levelBtns.forEach(btn => btn.disabled = false);
            
            updateStats();
            timeEl.textContent = '0';
        }
    })();
    
    
    // ===== 2. 神経衰弱ゲーム =====
    (function() {
        const emojis = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒'];
        
        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let clicks = 0;
        let timeCount = 0;
        let timerInterval = null;
        let isPlaying = false;
        let canClick = true;

        const gameBoardEl = document.getElementById('memory-board');
        const startBtn = document.getElementById('memory-start');
        const resetBtn = document.getElementById('memory-reset');
        const timeEl = document.getElementById('memory-time');
        const clicksEl = document.getElementById('memory-clicks');
        const pairsEl = document.getElementById('memory-pairs');
        const resultEl = document.getElementById('memory-result');
        const resultTextEl = document.getElementById('memory-resultText');

        startBtn.addEventListener('click', startGame);
        resetBtn.addEventListener('click', resetGame);

        function createBoard() {
            const gameCards = [...emojis, ...emojis];
            gameCards.sort(() => Math.random() - 0.5);
            
            gameBoardEl.innerHTML = '';
            cards = [];

            gameCards.forEach((emoji, index) => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.dataset.emoji = emoji;
                card.dataset.index = index;
                card.innerHTML = `
                    <div class="card-back">❓</div>
                    <div class="card-front">${emoji}</div>
                `;
                card.addEventListener('click', flipCard);
                gameBoardEl.appendChild(card);
                cards.push(card);
            });
        }

        function startGame() {
            if (isPlaying) return;
            
            isPlaying = true;
            matchedPairs = 0;
            clicks = 0;
            timeCount = 0;
            flippedCards = [];
            canClick = true;
            
            resultEl.style.display = 'none';
            startBtn.disabled = true;
            
            createBoard();
            updateStats();
            
            timerInterval = setInterval(() => {
                timeCount++;
                timeEl.textContent = timeCount;
            }, 1000);
        }

        function flipCard(e) {
            if (!isPlaying || !canClick) return;
            
            const card = e.currentTarget;
            
            if (card.classList.contains('flipped') || card.classList.contains('matched')) {
                return;
            }

            card.classList.add('flipped');
            flippedCards.push(card);
            clicks++;
            updateStats();

            if (flippedCards.length === 2) {
                canClick = false;
                checkMatch();
            }
        }

        function checkMatch() {
            const [card1, card2] = flippedCards;
            const emoji1 = card1.dataset.emoji;
            const emoji2 = card2.dataset.emoji;

            if (emoji1 === emoji2) {
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    matchedPairs++;
                    updateStats();
                    flippedCards = [];
                    canClick = true;

                    if (matchedPairs === emojis.length) {
                        endGame();
                    }
                }, 500);
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                    canClick = true;
                }, 1000);
            }
        }

        function updateStats() {
            clicksEl.textContent = clicks;
            pairsEl.textContent = `${matchedPairs}/${emojis.length}`;
        }

        function endGame() {
            isPlaying = false;
            clearInterval(timerInterval);
            startBtn.disabled = false;

            const minutes = Math.floor(timeCount / 60);
            const seconds = timeCount % 60;
            const timeText = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;

            resultTextEl.innerHTML = `
                <strong>クリア時間:</strong> ${timeText}<br>
                <strong>クリック数:</strong> ${clicks}回<br>
                <strong>効率:</strong> ${clicks <= 20 ? '素晴らしい！🌟' : clicks <= 30 ? '良好！👍' : '練習あるのみ！💪'}
            `;
            resultEl.style.display = 'block';
        }

        function resetGame() {
            isPlaying = false;
            clearInterval(timerInterval);
            
            matchedPairs = 0;
            clicks = 0;
            timeCount = 0;
            flippedCards = [];
            canClick = true;
            
            gameBoardEl.innerHTML = '';
            resultEl.style.display = 'none';
            startBtn.disabled = false;
            
            timeEl.textContent = '0';
            clicksEl.textContent = '0';
            pairsEl.textContent = '0/8';
        }

        createBoard();
    })();
    
    
    // ===== 3. クイズアプリ =====
    (function() {
        const quizData = [
            { category: '一般知識', question: '日本の首都はどこですか？', options: ['大阪', '京都', '東京', '名古屋'], correct: 2 },
            { category: '科学', question: '水の化学式は何ですか？', options: ['H2O', 'CO2', 'O2', 'NaCl'], correct: 0 },
            { category: '歴史', question: '第二次世界大戦が終結した年は？', options: ['1943年', '1944年', '1945年', '1946年'], correct: 2 },
            { category: '地理', question: '世界で最も高い山は？', options: ['富士山', 'エベレスト', 'キリマンジャロ', 'マッキンリー'], correct: 1 },
            { category: '科学', question: '光の速度はおよそ秒速何キロメートル？', options: ['30万km', '3万km', '300万km', '3000km'], correct: 0 },
            { category: '文化', question: '「モナリザ」を描いた画家は誰？', options: ['ピカソ', 'ゴッホ', 'ダ・ヴィンチ', 'ミケランジェロ'], correct: 2 },
            { category: '自然', question: '地球上で最も大きな海は？', options: ['大西洋', '太平洋', 'インド洋', '北極海'], correct: 1 },
            { category: '歴史', question: '日本で最初の元号は？', options: ['大化', '平成', '明治', '昭和'], correct: 0 },
            { category: '科学', question: '人間の体で最も大きな臓器は？', options: ['心臓', '肝臓', '肺', '皮膚'], correct: 3 },
            { category: 'スポーツ', question: 'オリンピックは何年ごとに開催される？', options: ['2年', '3年', '4年', '5年'], correct: 2 }
        ];

        let currentQuestion = 0;
        let score = 0;
        let selectedAnswer = null;

        const startScreen = document.getElementById('quiz-startScreen');
        const quizScreen = document.getElementById('quiz-screen');
        const resultScreen = document.getElementById('quiz-resultScreen');
        const startBtn = document.getElementById('quiz-start');
        const nextBtn = document.getElementById('quiz-next');
        const retryBtn = document.getElementById('quiz-retry');
        const questionNumber = document.getElementById('quiz-questionNumber');
        const progressFill = document.getElementById('quiz-progressFill');
        const scoreEl = document.getElementById('quiz-score');
        const categoryEl = document.getElementById('quiz-category');
        const questionEl = document.getElementById('quiz-question');
        const optionsEl = document.getElementById('quiz-options');

        startBtn.addEventListener('click', startQuiz);
        nextBtn.addEventListener('click', nextQuestion);
        retryBtn.addEventListener('click', resetQuiz);

        function startQuiz() {
            startScreen.style.display = 'none';
            quizScreen.style.display = 'block';
            currentQuestion = 0;
            score = 0;
            loadQuestion();
        }

        function loadQuestion() {
            const question = quizData[currentQuestion];
            selectedAnswer = null;
            
            questionNumber.textContent = `問題 ${currentQuestion + 1}/10`;
            progressFill.style.width = `${((currentQuestion + 1) / 10) * 100}%`;
            scoreEl.textContent = `得点: ${score}`;
            categoryEl.textContent = question.category;
            questionEl.textContent = question.question;
            
            optionsEl.innerHTML = '';
            question.options.forEach((option, index) => {
                const optionEl = document.createElement('div');
                optionEl.className = 'option';
                optionEl.textContent = option;
                optionEl.addEventListener('click', () => selectOption(index));
                optionsEl.appendChild(optionEl);
            });
            
            nextBtn.disabled = true;
        }

        function selectOption(index) {
            if (selectedAnswer !== null) return;
            
            selectedAnswer = index;
            const question = quizData[currentQuestion];
            const options = document.querySelectorAll('#quiz-options .option');
            
            options.forEach((option, i) => {
                option.classList.add('disabled');
                if (i === question.correct) {
                    option.classList.add('correct');
                }
                if (i === index && i !== question.correct) {
                    option.classList.add('incorrect');
                }
            });
            
            if (index === question.correct) {
                score += 10;
                scoreEl.textContent = `得点: ${score}`;
            }
            
            nextBtn.disabled = false;
        }

        function nextQuestion() {
            currentQuestion++;
            
            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                showResults();
            }
        }

        function showResults() {
            quizScreen.style.display = 'none';
            resultScreen.style.display = 'block';
            
            const correctCount = score / 10;
            const incorrectCount = 10 - correctCount;
            const accuracy = (correctCount / 10 * 100).toFixed(0);
            
            document.getElementById('quiz-finalScore').textContent = `${score}点`;
            document.getElementById('quiz-correctCount').textContent = `${correctCount}問`;
            document.getElementById('quiz-incorrectCount').textContent = `${incorrectCount}問`;
            document.getElementById('quiz-accuracy').textContent = `${accuracy}%`;
            
            let message = '';
            if (score === 100) {
                message = '完璧です！素晴らしい！🌟';
            } else if (score >= 80) {
                message = 'とても良くできました！👏';
            } else if (score >= 60) {
                message = '良い成績です！💪';
            } else if (score >= 40) {
                message = 'もう少し頑張りましょう！📚';
            } else {
                message = '次は頑張りましょう！💡';
            }
            
            document.getElementById('quiz-resultMessage').textContent = message;
        }

        function resetQuiz() {
            resultScreen.style.display = 'none';
            startScreen.style.display = 'block';
            currentQuestion = 0;
            score = 0;
        }
    })();
    
    
    // ===== 4. 色当てゲーム =====
    (function() {
        let currentMode = 'rgb';
        let currentColor = null;
        let correctAnswer = null;
        let questionNumber = 0;
        let correctCount = 0;
        let totalScore = 0;
        let isPlaying = false;
        let hasAnswered = false;

        const maxQuestions = 10;
        const colorDisplayEl = document.getElementById('color-display');
        const questionEl = document.getElementById('color-question');
        const optionsEl = document.getElementById('color-options');
        const startBtn = document.getElementById('color-start');
        const nextBtn = document.getElementById('color-next');
        const resetBtn = document.getElementById('color-reset');
        const questionCountEl = document.getElementById('color-questionCount');
        const correctEl = document.getElementById('color-correct');
        const scoreEl = document.getElementById('color-score');
        const resultEl = document.getElementById('color-result');
        const resultTextEl = document.getElementById('color-resultText');
        const modeBtns = document.querySelectorAll('#color-game .mode-btn');

        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!isPlaying) {
                    modeBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentMode = btn.dataset.mode;
                }
            });
        });

        startBtn.addEventListener('click', startGame);
        nextBtn.addEventListener('click', nextQuestion);
        resetBtn.addEventListener('click', resetGame);

        function generateRandomColor() {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            return { r, g, b };
        }

        function rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('').toUpperCase();
        }

        function getColorString(color) {
            if (currentMode === 'rgb') {
                return `rgb(${color.r}, ${color.g}, ${color.b})`;
            } else {
                return rgbToHex(color.r, color.g, color.b);
            }
        }

        function generateWrongAnswers(correctColor) {
            const answers = [getColorString(correctColor)];
            
            while (answers.length < 4) {
                const variation = Math.floor(Math.random() * 50) + 20;
                const wrongColor = {
                    r: Math.max(0, Math.min(255, correctColor.r + (Math.random() > 0.5 ? variation : -variation))),
                    g: Math.max(0, Math.min(255, correctColor.g + (Math.random() > 0.5 ? variation : -variation))),
                    b: Math.max(0, Math.min(255, correctColor.b + (Math.random() > 0.5 ? variation : -variation)))
                };
                const wrongString = getColorString(wrongColor);
                if (!answers.includes(wrongString)) {
                    answers.push(wrongString);
                }
            }
            
            return answers.sort(() => Math.random() - 0.5);
        }

        function startGame() {
            if (isPlaying) return;
            
            isPlaying = true;
            questionNumber = 0;
            correctCount = 0;
            totalScore = 0;
            
            resultEl.style.display = 'none';
            startBtn.disabled = true;
            modeBtns.forEach(btn => btn.disabled = true);
            
            nextQuestion();
        }

        function nextQuestion() {
            if (questionNumber >= maxQuestions) {
                endGame();
                return;
            }

            questionNumber++;
            hasAnswered = false;
            nextBtn.disabled = true;
            
            currentColor = generateRandomColor();
            correctAnswer = getColorString(currentColor);
            
            colorDisplayEl.style.background = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
            
            const answers = generateWrongAnswers(currentColor);
            
            optionsEl.innerHTML = '';
            answers.forEach(answer => {
                const option = document.createElement('div');
                option.className = 'option';
                option.textContent = answer;
                option.addEventListener('click', () => selectAnswer(answer, option));
                optionsEl.appendChild(option);
            });
            
            updateStats();
        }

        function selectAnswer(selected, optionEl) {
            if (hasAnswered) return;
            
            hasAnswered = true;
            const options = document.querySelectorAll('#color-options .option');
            
            options.forEach(opt => {
                opt.classList.add('disabled');
                if (opt.textContent === correctAnswer) {
                    opt.classList.add('correct');
                }
            });
            
            if (selected === correctAnswer) {
                optionEl.classList.add('correct');
                correctCount++;
                totalScore += 10;
            } else {
                optionEl.classList.add('incorrect');
            }
            
            updateStats();
            nextBtn.disabled = false;
        }

        function updateStats() {
            questionCountEl.textContent = `${questionNumber}/${maxQuestions}`;
            correctEl.textContent = correctCount;
            scoreEl.textContent = totalScore;
        }

        function endGame() {
            isPlaying = false;
            startBtn.disabled = false;
            modeBtns.forEach(btn => btn.disabled = false);
            nextBtn.disabled = true;

            const accuracy = ((correctCount / maxQuestions) * 100).toFixed(0);
            const modeText = currentMode === 'rgb' ? 'RGB形式' : 'HEX形式';

            resultTextEl.innerHTML = `
                <strong>モード:</strong> ${modeText}<br>
                <strong>正解数:</strong> ${correctCount}/${maxQuestions}<br>
                <strong>正答率:</strong> ${accuracy}%<br>
                <strong>最終スコア:</strong> ${totalScore}点<br><br>
                ${accuracy >= 80 ? '素晴らしい！🌟' : accuracy >= 60 ? '良くできました！👍' : '次は頑張りましょう！💪'}
            `;
            resultEl.style.display = 'block';
        }

        function resetGame() {
            isPlaying = false;
            questionNumber = 0;
            correctCount = 0;
            totalScore = 0;
            hasAnswered = false;
            
            colorDisplayEl.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            optionsEl.innerHTML = '';
            resultEl.style.display = 'none';
            
            startBtn.disabled = false;
            nextBtn.disabled = true;
            modeBtns.forEach(btn => btn.disabled = false);
            
            updateStats();
        }
    })();
    
    
    // ===== 5. リアクションゲーム =====
    (function() {
        const gameArea = document.getElementById('reaction-area');
        const attemptCountEl = document.getElementById('reaction-attemptCount');
        const avgTimeEl = document.getElementById('reaction-avgTime');
        const bestTimeEl = document.getElementById('reaction-bestTime');
        const attemptsListEl = document.getElementById('reaction-attemptsList');
        const attemptsContentEl = document.getElementById('reaction-attemptsContent');
        const resultEl = document.getElementById('reaction-result');
        const resultContentEl = document.getElementById('reaction-resultContent');
        const resetBtn = document.getElementById('reaction-reset');

        let state = 'start';
        let startTime = 0;
        let timeout = null;
        let attempts = [];
        const maxAttempts = 5;

        gameArea.addEventListener('click', handleClick);
        resetBtn.addEventListener('click', resetGame);

        function handleClick() {
            if (state === 'start') {
                startRound();
            } else if (state === 'waiting') {
                tooEarly();
            } else if (state === 'ready') {
                recordTime();
            }
        }

        function startRound() {
            if (attempts.length >= maxAttempts) return;
            
            state = 'waiting';
            gameArea.className = 'reaction-area waiting';
            gameArea.innerHTML = `
                <div class="reaction-message">待って...</div>
                <div class="reaction-instruction">緑色になったらクリック！</div>
            `;

            const delay = Math.random() * 4000 + 2000;
            
            timeout = setTimeout(() => {
                state = 'ready';
                startTime = Date.now();
                gameArea.className = 'reaction-area ready';
                gameArea.innerHTML = `
                    <div class="reaction-message">今だ！</div>
                    <div class="reaction-instruction">クリック！</div>
                `;
            }, delay);
        }

        function tooEarly() {
            clearTimeout(timeout);
            state = 'start';
            gameArea.className = 'reaction-area result';
            gameArea.innerHTML = `
                <div class="reaction-message">フライング！</div>
                <div class="reaction-instruction">早すぎました。もう一度クリックしてやり直し</div>
            `;
        }

        function recordTime() {
            const reactionTime = Date.now() - startTime;
            attempts.push(reactionTime);
            
            state = 'result';
            gameArea.className = 'reaction-area result';
            gameArea.innerHTML = `
                <div class="time-display">${reactionTime}ms</div>
                <div class="reaction-instruction">${attempts.length < maxAttempts ? 'クリックして次へ' : '完了！'}</div>
            `;
            
            updateStats();
            displayAttempts();
            
            if (attempts.length < maxAttempts) {
                state = 'start';
            } else {
                showFinalResults();
            }
        }

        function updateStats() {
            attemptCountEl.textContent = `${attempts.length}/${maxAttempts}`;
            
            if (attempts.length > 0) {
                const avg = Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length);
                avgTimeEl.textContent = `${avg}ms`;
                
                const best = Math.min(...attempts);
                bestTimeEl.textContent = `${best}ms`;
            }
        }

        function displayAttempts() {
            if (attempts.length === 0) return;
            
            attemptsListEl.style.display = 'block';
            const bestTime = Math.min(...attempts);
            
            attemptsContentEl.innerHTML = attempts.map((time, index) => `
                <div class="attempt-item ${time === bestTime ? 'best' : ''}">
                    <span class="attempt-number">試行 ${index + 1}</span>
                    <span class="attempt-time">${time}ms ${time === bestTime ? '🏆' : ''}</span>
                </div>
            `).join('');
        }

        function showFinalResults() {
            const avg = Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length);
            const best = Math.min(...attempts);
            const worst = Math.max(...attempts);
            
            let rating = '';
            if (avg < 200) {
                rating = '超人的！⚡';
            } else if (avg < 250) {
                rating = '素晴らしい！🌟';
            } else if (avg < 300) {
                rating = '良好！👍';
            } else if (avg < 350) {
                rating = '平均的！😊';
            } else {
                rating = '練習あるのみ！💪';
            }
            
            resultContentEl.innerHTML = `
                <div class="result-text">
                    <strong>平均タイム:</strong> ${avg}ms<br>
                    <strong>ベストタイム:</strong> ${best}ms<br>
                    <strong>ワーストタイム:</strong> ${worst}ms<br>
                    <strong>評価:</strong> ${rating}
                </div>
            `;
            resultEl.style.display = 'block';
        }

        function resetGame() {
            clearTimeout(timeout);
            state = 'start';
            attempts = [];
            
            gameArea.className = 'reaction-area start';
            gameArea.innerHTML = `
                <div class="reaction-message">準備はいい？</div>
                <div class="reaction-instruction">クリックしてスタート</div>
            `;
            
            attemptCountEl.textContent = '0/5';
            avgTimeEl.textContent = '-';
            bestTimeEl.textContent = '-';
            attemptsListEl.style.display = 'none';
            attemptsContentEl.innerHTML = '';
            resultEl.style.display = 'none';
        }
    })();
    
    
    // ===== 6. パズルゲーム (2048) =====
    (function() {
        const gridEl = document.getElementById('puzzle-grid');
        const scoreEl = document.getElementById('puzzle-score');
        const bestEl = document.getElementById('puzzle-best');
        const gameOverEl = document.getElementById('puzzle-gameOver');
        const finalScoreEl = document.getElementById('puzzle-finalScore');
        const newGameBtn = document.getElementById('puzzle-new');
        const gameOverBtn = document.getElementById('puzzle-gameOverBtn');

        let grid = [];
        let score = 0;
        let best = localStorage.getItem('best2048') || 0;
        bestEl.textContent = best;

        newGameBtn.addEventListener('click', initGrid);
        gameOverBtn.addEventListener('click', initGrid);

        function initGrid() {
            grid = Array(4).fill().map(() => Array(4).fill(0));
            score = 0;
            scoreEl.textContent = score;
            gameOverEl.classList.remove('show');
            addNewTile();
            addNewTile();
            renderGrid();
        }

        function renderGrid() {
            gridEl.innerHTML = '';
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'puzzle-cell';
                    const value = grid[i][j];
                    if (value > 0) {
                        const tile = document.createElement('div');
                        tile.className = `puzzle-tile tile-${value > 2048 ? 'super' : value}`;
                        tile.textContent = value;
                        cell.appendChild(tile);
                    }
                    gridEl.appendChild(cell);
                }
            }
        }

        function addNewTile() {
            const emptyCells = [];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (grid[i][j] === 0) {
                        emptyCells.push([i, j]);
                    }
                }
            }
            if (emptyCells.length > 0) {
                const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                grid[i][j] = Math.random() < 0.9 ? 2 : 4;
            }
        }

        function move(direction) {
            let moved = false;
            const oldGrid = JSON.stringify(grid);

            if (direction === 'left' || direction === 'right') {
                for (let i = 0; i < 4; i++) {
                    const row = grid[i].filter(val => val !== 0);
                    const newRow = mergeTiles(row, direction === 'left');
                    while (newRow.length < 4) {
                        direction === 'left' ? newRow.push(0) : newRow.unshift(0);
                    }
                    grid[i] = newRow;
                }
            } else {
                for (let j = 0; j < 4; j++) {
                    const col = grid.map(row => row[j]).filter(val => val !== 0);
                    const newCol = mergeTiles(col, direction === 'up');
                    while (newCol.length < 4) {
                        direction === 'up' ? newCol.push(0) : newCol.unshift(0);
                    }
                    for (let i = 0; i < 4; i++) {
                        grid[i][j] = newCol[i];
                    }
                }
            }

            if (JSON.stringify(grid) !== oldGrid) {
                moved = true;
                addNewTile();
                renderGrid();
                updateScore();
                
                if (isGameOver()) {
                    setTimeout(() => {
                        finalScoreEl.textContent = `最終スコア: ${score}`;
                        gameOverEl.classList.add('show');
                    }, 300);
                }
            }
        }

        function mergeTiles(tiles, forward) {
            const result = [];
            let i = 0;
            
            while (i < tiles.length) {
                if (i < tiles.length - 1 && tiles[i] === tiles[i + 1]) {
                    const merged = tiles[i] * 2;
                    result.push(merged);
                    score += merged;
                    i += 2;
                } else {
                    result.push(tiles[i]);
                    i++;
                }
            }
            
            return result;
        }

        function updateScore() {
            scoreEl.textContent = score;
            if (score > best) {
                best = score;
                bestEl.textContent = best;
                localStorage.setItem('best2048', best);
            }
        }

        function isGameOver() {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (grid[i][j] === 0) return false;
                    if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
                    if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
                }
            }
            return true;
        }

        document.addEventListener('keydown', (e) => {
            if (document.getElementById('puzzle-game').style.display === 'none') return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                move('left');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                move('right');
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                move('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                move('down');
            }
        });

        let touchStartX = 0;
        let touchStartY = 0;

        gridEl.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        gridEl.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
                move(dx > 0 ? 'right' : 'left');
            } else if (Math.abs(dy) > 30) {
                move(dy > 0 ? 'down' : 'up');
            }
        });

        initGrid();
    })();
    
});