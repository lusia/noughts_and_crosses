$(document).ready(function () {
        var number,
            arr = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ],
            nextMove = "o",
            currentMove = "x",
            fCheckRows, fCheckColumns, fCheckCrossFromLeft, fCheckCrossFromRight, pos, steps = 0,
            fCheckRow, GameResult, changeActivePlayer;

        GameResult = function (what, position, result) {
            this.what = what;
            this.position = position;
            this.result = result;
        };

        /**
         * check if array elements are identical
         * @param row - array
         * @return {Boolean}
         */
        fCheckRow = function (row) {
            var result = false;
            console.log(row);
            if ((row[0] === row[1]) && (row[1] === row[2]) && (jQuery.inArray(null, row) === -1)) {
                result = true;
            }

            return result;
        };

        /**
         * check if elements in the rows are identical - it means if someone wins
         * @param arr - array
         * @return Array of game results object
         */
        fCheckRows = function (arr) {
            var results = [];

            for (var i = 0; i < arr.length; i++) {
                results.push(new GameResult('row', i, fCheckRow(arr[i])));
            }

            return results;
        };

        /**
         * check if elements in the columns are identical - it means if someone wins
         * @param arr - array
         * @return Array of game results object
         */
        fCheckColumns = function (arr) {
            var results = [],
                columns = _.zip(arr[0], arr[1], arr[2]);

            for (var i = 0; i < columns.length; i++) {
                results.push(new GameResult('col', i, fCheckRow(columns[i])));
            }

            return results;
        };

        /**
         * check if elements in the cross from left to right are identical - it means if someone wins
         * lr means left to right
         * @param arr - array
         * @return Array return results;
         */
        fCheckCrossFromLeft = function (arr) {
            var results = [],
                row = [arr[0][0], arr[1][1], arr[2][2]];

            results.push(new GameResult('crossl', 'lr', fCheckRow(row)));

            return results;
        };

        /**
         * check if elements in the cross from right to left are identical - it means if someone wins
         * rl means right to left
         * @param arr - array
         * @return Array return results;
         */
        fCheckCrossFromRight = function (arr) {
            var results = [],
                row = [arr[0][2], arr[1][1], arr[2][0]];

            results.push(new GameResult('crossr', 'rl', fCheckRow(row)));

            return results;
        };

        $("span#hint").text("o" + " " + "move");
        $("table#game-field td").hover(function () {
                $(this).addClass("hover");
            },
            function () {
                $(this).removeClass("hover");
            }
        );
        /**
         * Verify current move and the next move
         */
        changeActivePlayer = function () {

            if (nextMove === "o") {
                nextMove = 'x';
                currentMove = 'o';
            } else {
                nextMove = 'o';
                currentMove = 'x';
            }
        };
        /**
         * Display winner and
         * Find position in the array and highlight it
         * @param arr
         */
        checkWinner = function (arr) {
            final = [].concat(fCheckRows(arr), fCheckColumns(arr), fCheckCrossFromLeft(arr), fCheckCrossFromRight(arr));
            gr = _.findWhere(final, {result:true}); //gameResult
            if (gr !== undefined) {
                $("table#game-field td").unbind("click");
                $("#hint").text("Well done, '" + currentMove + "' wins this game!");
                $("#info_block").css({width:"500px", height:"80px", "font-size":"20px", background:"pink"})

                pos = gr.position;
                switch (gr.what) {
                    case 'col':
                        $("td:nth-child(" + (pos + 1) + ")").addClass("highlight");
                        break;
                    case 'row':
                        $("td:lt(" + (3 * pos + 3) + ")").slice(3 * pos).addClass("highlight");
                        break;
                    case 'crossr':
                        $("td:eq(2), td:eq(4), td:eq(6)").addClass("highlight");
                        break;
                    case 'crossl':
                        $("td:eq(0), td:eq(4), td:eq(8)").addClass("highlight");
                        break;
                }
            }
        };

        /**
         * Handle action game
         */
        $("table#game-field td").click(function () {
                var value = parseInt($(this).attr("data-value"), 10),
                    row = Math.floor(value / 3),
                    col = value % 3,
                    final, gr, pos;

                $(this).addClass("cell").text(nextMove).unbind("click");
                $("span#hint").text(currentMove + " " + "move");
                changeActivePlayer();
                steps++;
                arr[row][col] = currentMove;
                checkWinner(arr);
            }

        ); // edn td click

    }
);
