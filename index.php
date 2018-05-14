<?php
require_once(__DIR__.'/../wp-load.php');

//if(!current_user_can('manage_options')) exit(wp_redirect('https://www.testingmom.com/login/?redirect_to=/100free'));
require_once('questions.php');

global $ques_db, $game_db;
?>

<!DOCTYPE html>
<html>
    <head>
        <link type="text/css" rel="stylesheet" href="style.css" />
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script type="text/javascript" src="seo-page-questions.js"></script>
        <style type="text/css">
        <?php if(isset($_GET['grade']) && is_numeric($_GET['grade'])){?>
            #home{display:none;}
            #top-marketing{display:block;}
        <?php } ?>
        </style>
    </head>
    <body>
<!--         <?php 
        //$url = "seo-page-questions.php?grade=".$_GET['grade']."&test=".$_GET['test'];
        ?>
        <div id="frame">
            <iframe id="window" src=<?php //echo $url;?>></iframe>
        </div> -->
        <div id="muteBtn">
            <div id="muteImg"></div>
            <div id="unmuteImg"></div>
        </div>

        <div id="questions">
            <div id="back"></div>
        </div>

        <div id="audio">
            <div class="game">
                <div class="wrong">
                    <audio><source src="../100free/audio/game/NiceTry_message.mp3" type="audio/mpeg"></audio>
                    <audio><source src="../100free/audio/game/TryAgain_message.mp3" type="audio/mpeg"></audio>
                </div>
                <div class="correct">
                    <audio><source src="../100free/audio/game/Awesome_message.mp3" type="audio/mpeg"></audio>
                    <audio><source src="../100free/audio/game/GoodWork_message.mp3" type="audio/mpeg"></audio>
                    <audio><source src="../100free/audio/game/Lesson_format_CorrectSound1.mp3" type="audio/mpeg"></audio>
                    <audio><source src="../100free/audio/game/Lesson_format_CorrectSound2.mp3" type="audio/mpeg"></audio>
                    <audio><source src="../100free/audio/game/Lesson_format_CorrectSound3.mp3" type="audio/mpeg"></audio>
                </div>
            </div>
        </div>

        <script type="text/javascript">
            ftg = new ftgames;
            <?php if (isset($_GET['grade']) && isset($_GET['test'])) {?>
            ftg.init(<?php echo $_GET['grade'];?>, <?php echo $_GET['test'];?>);
            <?php } else { ?>
            $('#questions').html('Please add both `grade` and `test` query parameters!');
            <?php } ?>
        </script>
  </body>
</html>
