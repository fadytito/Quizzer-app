/// <reference path="../typings/globals/jquery/index.d.ts" />
$(function () {

    const DataCtrl = (function () {

        const data = {
            panels: {
                current: 0,
                next: function () {
                    return this.current + 1;
                }
            },
            questions: {
                number: 8,
                answers: []
            }
        }

        return {
            findPanel: function () {

                let currentPanel = $(`div[data-panel=${data.panels.current}]`),
                    nextPanel = $(`div[data-panel=${data.panels.next()}]`);

                return {
                    currentPanel,
                    nextPanel
                }
            },
            updateCurrent: function () {
                data.panels.current += 1;
            },
            getQuestionsNum: function () {
                return data.questions.number;
            },
            storeAnswer: function (answer) {
                data.questions.answers.push(answer.text());
                console.log(data.questions.answers)
            }
        }

    })();






    const UICtrl = (function () {
        // Define UI selectors
        const UISelectors = {
            panelStart: $('.panel-0'),
            panel: $('.panel'),
            appTitle: $('.title'),
            startBtn: $('.start-btn'),
            nextBtn: $('.next-btn'),
            answers: $('.answers'),
            answersOption: $('.answers li'),
            bar: $('.bar'),
            progress: $('.progress'),
            error: $('.error')
        }

        return {

            startHomeAnimation: function () {
                UISelectors.panelStart.show();
                UISelectors.appTitle.animate({
                    opacity: '1',
                    marginLeft: '0'
                }, 1000, function () {
                    UISelectors.startBtn.addClass('btn-animated');
                });
            },

            hideAndShowPanels: function (currentPanel, nextPanel) {
                currentPanel.animate({
                    opacity: '0',
                    marginLeft: '-150px'
                }, 500, function () {
                    $(this).hide();

                    nextPanel.removeClass('hidden');
                    nextPanel.animate({
                        opacity: '1',
                        marginLeft: '0'
                    }, 500)
                })
            },

            animateAnswers: function (currentPanel) {
                let waitTime = 1000;
                currentPanel.find('li').each(function (i, el) {
                    $(el).delay(waitTime).fadeIn(300);
                    waitTime += 500;
                });
            },

            addActiveState: function (answer) {
                // Remove active class from all answers
                UISelectors.answersOption.removeClass('active');

                // Add active class to selected answer only
                answer.addClass('active');
            },

            nextValid: function (currentPanel) {
                currentPanel.find(UISelectors.nextBtn).addClass('btn-animated');
            },

            showProgress: function (questionsNum) {
                // Calculate progress width
                const width = (100 / questionsNum) + '%';

                // Make progress
                UISelectors.progress.animate({ width: `+=${width}` }, 500);
            },

            showErrorMsg: function () {
                UISelectors.error.show();

                setTimeout(function () {
                    UISelectors.error.fadeOut(500);
                }, 1000)

            },

            getSelectors: function () {
                return UISelectors;
            }
        }

    })();






    const App = (function (DataCtrl, UICtrl) {

        // Load event listeners
        function loadEventListeners() {
            // Get UI selectors
            const UISelectors = UICtrl.getSelectors();

            UISelectors.startBtn.on('click', loadQuestion);

            UISelectors.nextBtn.on('click', nextQuestion);

            UISelectors.answersOption.on('click', chooseAnswer);
        }

        // Get questions number
        function getQuestionsNum() {
            const questionsNum = DataCtrl.getQuestionsNum();
            return questionsNum;
        }

        // Create load question function
        function loadQuestion() {
            // Get current and next panels
            let currentPanel = DataCtrl.findPanel().currentPanel,
                nextPanel = DataCtrl.findPanel().nextPanel;

            // Hide and show panels
            UICtrl.hideAndShowPanels(currentPanel, nextPanel);

            // Update current and next counters
            DataCtrl.updateCurrent();

            // Get updated panels
            currentPanel = DataCtrl.findPanel().currentPanel;

            // Animate answers options
            UICtrl.animateAnswers(currentPanel);

        }

        // Create choose answer function
        function chooseAnswer() {

            currentPanel = DataCtrl.findPanel().currentPanel;

            // Add active state to selected answer
            UICtrl.addActiveState($(this));

            // Validate next btn
            UICtrl.nextValid(currentPanel);

        }

        // Create next question function
        function nextQuestion() {

            currentPanel = DataCtrl.findPanel().currentPanel;

            const selectedAnswer = currentPanel.find($('.answers li.active'));

            if (selectedAnswer.length !== 0) {

                loadQuestion();

                UICtrl.showProgress(getQuestionsNum());

                DataCtrl.storeAnswer(selectedAnswer);

            } else {
                UICtrl.showErrorMsg();
            }
        }


        return {
            init: function () {
                UICtrl.startHomeAnimation();

                loadEventListeners();
            }
        }

    })(DataCtrl, UICtrl);


    App.init();

});

