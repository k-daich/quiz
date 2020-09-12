package main.java.jp.net.daich.quiz.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jp.net.daich.quiz.form.request.GetQForm;

@Controller
@ResponseBody
public class GetQController {

    // @Autowired
    // CreateLetterInfoProcedure createLetterInfoProcedure;

    private Logger logger = LogManager.getLogger();

    @RequestMapping(path = "/getQ", method = RequestMethod.GET)
    public ResponseEntity<String> execute(@RequestParam("quizId") String sentence_id) {
        // return ResponseEntity.ok(
        //         // LetterInfoの生成
        //         createLetterInfoProcedure.execute(quizId));

        return ResponseEntity.ok("response OK");
    }

}
