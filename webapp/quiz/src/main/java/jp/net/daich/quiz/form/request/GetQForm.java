package jp.net.daich.quiz.form.request;

public class GetQForm {

    /**
     * コンストラクタ
     */
    GetQForm() {
    }

    private long quizId;

    /**
     * クイズIDを取得する
     * 
     * @return クイズID
     */
    public long getQuizId() {
        return quizId;
    }

    /**
     * クイズIDを設定する
     * 
     * @param quizId クイズID
     */
    public void setQuizId(long quizId) {
        this.quizId = quizId;
    }
}