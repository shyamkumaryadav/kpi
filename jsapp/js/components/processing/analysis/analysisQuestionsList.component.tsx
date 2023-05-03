import React, {useContext} from 'react';
import AnalysisQuestionsContext from './analysisQuestions.context';
import AnalysisQuestionEditor from './editors/analysisQuestionEditor.component';
import DefaultResponseForm from './responseForms/defaultResponseForm.component';
import KeywordSearchResponseForm from './responseForms/keywordSearchResponseForm.component';
import SelectMultipleResponseForm from './responseForms/selectMultipleResponseForm.component';
import SelectOneResponseForm from './responseForms/selectOneResponseForm.component';
import TagsResponseForm from './responseForms/tagsResponseForm.component';
import CommonHeader from './responseForms/commonHeader.component';
import styles from './analysisQuestionsList.module.scss';
import type {AnalysisQuestion} from './constants';

export default function AnalysisQuestionsList() {
  const analysisQuestions = useContext(AnalysisQuestionsContext);

  function renderItem(question: AnalysisQuestion) {
    if (analysisQuestions?.state.questionsBeingEdited.includes(question.uid)) {
      return <AnalysisQuestionEditor uid={question.uid} />;
    } else {
      switch (question.type) {
        case 'aq_keyword_search': {
          return <KeywordSearchResponseForm uid={question.uid} />;
        }
        case 'aq_note': {
          // This question type doesn't have any response
          return <CommonHeader uid={question.uid} />;
        }
        case 'aq_select_multiple': {
          return <SelectMultipleResponseForm uid={question.uid} />;
        }
        case 'aq_select_one': {
          return <SelectOneResponseForm uid={question.uid} />;
        }
        case 'aq_tags': {
          return <TagsResponseForm uid={question.uid} />;
        }
        default: {
          return <DefaultResponseForm uid={question.uid} />;
        }
      }
    }
  }

  return (
    <ul className={styles.root}>
      {analysisQuestions?.state.questions.map((question) => (
        <li className={styles.row} key={question.uid}>
          {renderItem(question)}
        </li>
      ))}
    </ul>
  );
}
