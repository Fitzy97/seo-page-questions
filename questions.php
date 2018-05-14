<?php
global $game_db, $ques_db, $wpdb;
require_once __DIR__.'/../wp-load.php';

class questions
{
    public $skills = array();
    public $children;
    private $db;

    public function __construct()
    {
        global $wpdb;
        $this->db = $wpdb;
        if (isset($_POST['func']) && ($_POST['func'] == 'getQuestions')) {
            $func = $_POST['func'];
            $r = $this->$func();
            exit($r);
        }
    }

    public function getQuestions()
    {
        $sql = "SELECT a.ques_id FROM taxonomy_assoc a, taxonomy t WHERE 
                t.taxonomy = 'app' AND t.title = '100 Free Questions' AND t.id = a.tax_id";
        $free = $this->db->get_col($sql);

        $sql = "SELECT q.id, q.question, q.image, q.audio, q.primary_test, q.answer, q.explanation, 
                a.id as aid, a.ansH, a.ansW, a.ansX, a.ansY, a.ansAreaH, a.ansAreaW, a.ansAreaX, a.ansAreaY, 
                i.image, i.width as img_w, i.height as img_h, 
                i2.image as ans_image, i2.width as ans_width, i2.height as ans_height 
                FROM (questions q, answer_area a) 
                LEFT JOIN (images i) ON (i.id = q.image) 
                LEFT JOIN (images i2) ON (i2.id = q.ans_image) 
                WHERE q.id = a.ques_id AND (".$_POST['grade']." BETWEEN q.min_grade AND q.max_grade) 
                AND q.primary_test = ".$_POST['test']." AND q.id IN (".implode(',', $free).") 
                ORDER BY q.id ASC
                LIMIT 0,5";
        $questions = $this->db->get_results($sql);

        $desc = $this->get_desc();
        $output = "";

        $html = '';
        foreach ($questions as $k=>$q) {
            $html .= '<div id="question'.$k.'" class="question" data-question="'.$q->id.'">';
            $html .= '<div class="answerImage'.$k.' answerImage"><div class="correctImage"></div><div class="incorrectImage"></div></div>';
            $html .= '<div class="descTop">';
            if (isset($desc[$q->primary_test])) {
                $html .= $desc[$q->primary_test]->description;
            }
            $html .= '</div>';
            $html .= '<div class="baby">';
            $html .= '<img src="https://www.testingmom.com/100free/img/babies/spacebaby_'.rand(1, 34).'.png" alt=""/>';
            $html .= '</div>';
            $html .= '<div class="questionText"><p>';
            $html .= str_replace(array("\n\r", "\n", "\r"), '', nl2br(stripslashes($q->question)));
            $html .= '</p></div>';
            if (isset($q->audio) && !empty($q->audio)) {
                $html .= '<div class="audio"><audio id="question_audio'.$k.'">';
                $html .= '<source src="https://63fde95f2ab77a6f1739-1c81251d98ab87d5cc83c544d3350168';
                $html .= '.ssl.cf2.rackcdn.com/audio/'.$q->audio.'" type="audio/mpeg">';
                $html .= '</audio></div>';

                $html .= '<div id="soundBtn'.$k.'" class="soundBtn">';
                $html .= '<div class="playBtn"></div>';
                $html .= '<div class="pauseBtn"></div></div>';
            }
            if (isset($q->ans_image) && !empty($q->ans_image)) {
                $html .= '<div class="img">';
                $html .= '<img src="https://63fde95f2ab77a6f1739-1c81251d98ab87d5cc83c544d3350168.ssl.cf2.rackcdn.com';
                $html .= '/'.$q->image.'" alt="" data-width="'.$q->img_w.'" data-height="'.$q->img_h.'"/></div>';
                $html .= '<div class="answer" style="width:'.$q->ans_width.'px;height:'.$q->ans_height.'px;">';
                $html .= '<div class="img" style="width:'.$q->ans_width.'px;height:'.$q->ans_height.'px;margin:0px '.$aMarginL.'px;">';
                $html .= '<img src="https://63fde95f2ab77a6f1739-1c81251d98ab87d5cc83c544d3350168.ssl.cf2.rackcdn.com';
                $html .= '/'.$q->ans_image.'" alt="" data-width="'.$q->ans_width.'" data-height="'.$q->ans_height.'"/></div>';
                $html .= '<div class="correct" data-width="'.$q->ansW.'" data-height="'.$q->ansH.'"';
                $html .= ' data-posy="'.($q->ansY).'" data-posx="'.$q->ansX.'" ></div>';
                $html .= '<div class="wrong" data-width="'.$q->ansAreaW.'" data-height="'.$q->ansAreaH.'"';
                $html .= ' data-posy="'.$q->ansAreaY.'" data-posx="'.$q->ansAreaX.'"></div>';
                $html .= '</div>';
            } else {
                $html .= '<div class="answer">';
                $html .= '<div class="img">';
                $html .= '<img class="image" src="https://63fde95f2ab77a6f1739-1c81251d98ab87d5cc83c544d3350168.ssl.cf2.rackcdn.com/';
                $html .= $q->image.'" alt="" data-width="'.$q->img_w.'" data-height="'.$q->img_h.'"/></div>';
                $html .= '<div class="correct" data-width="'.$q->ansW.'" data-height="'.$q->ansH.'"';
                $html .= ' data-posy="'.($q->ansY).'" data-posx="'.$q->ansX.'" ></div>';
                $html .= '<div class="wrong" data-width="'.$q->ansAreaW.'" data-height="'.$q->ansAreaH.'"';
                $html .= ' data-posy="'.$q->ansAreaY.'" data-posx="'.$q->ansAreaX.'"></div>';
                $html .= '</div>';
            }
            $html .= '</div>';
        }
        if ($html == '') {
            $html .= '<h2>There are no test questions that match your search criteria!</h2>';
        }

        $output .= "$('#questions').html('".addslashes($html)."');";
        return $output;
    }

    private function get_desc()
    {
        return $this->db->get_results("SELECT id, description FROM taxonomy WHERE taxonomy = 'test' AND (parent = 0 OR parent IS NULL)", OBJECT_K);
    }
}

new questions;
