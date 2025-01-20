'use client';

import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Question, QuestionType } from '../types/quiz';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  difficulty: Yup.string()
    .oneOf(['EASY', 'MEDIUM', 'HARD'])
    .required('Difficulty is required'),
  timeLimit: Yup.number()
    .min(1, 'Time limit must be at least 1')
    .nullable(),
  questions: Yup.array().of(
    Yup.object({
      title: Yup.string().required('Question is required'),
      type: Yup.string()
        .oneOf(['SINGLE', 'MULTIPLE', 'OPEN'])
        .required('Type is required'),
      answers: Yup.array().when('type', ([type], schema) => {
        return type === 'OPEN' 
          ? schema 
          : schema.min(2, 'At least 2 answers required');
      }),
      correctAnswer: Yup.array().when('type', ([type], schema) => {
        if (type === 'SINGLE') {
          return schema
            .min(1, 'Select one correct answer')
            .max(1, 'Only one correct answer allowed');
        }
        if (type === 'MULTIPLE') {
          return schema
            .min(1, 'Select at least one correct answer');
        }
        // OPEN type
        return schema
          .min(1, 'At least one correct answer is required');
      })
    })
  ).min(1, 'At least one question is required'),
});

interface QuizFormProps {
  onSubmit: (quizData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

export default function QuizForm({ onSubmit, initialData, isEditing = false }: QuizFormProps) {
  const initialQuestionState = {
    title: '',
    type: 'SINGLE' as QuestionType,
    answers: ['', ''],
    correctAnswer: [],
  };

  const initialValues = {
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    difficulty: initialData?.difficulty || 'MEDIUM',
    timeLimit: initialData?.timeLimit || null,
    questions: initialData?.questions || [initialQuestionState],
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">
        {isEditing ? 'Edit Quiz' : 'Create Quiz'}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200">Title</label>
                <Field
                  name="title"
                  className="mt-1 w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">Description</label>
                <Field
                  name="description"
                  as="textarea"
                  className="mt-1 w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200">Category</label>
                  <Field
                    name="category"
                    className="mt-1 w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200"
                  />
                  <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200">Difficulty</label>
                  <Field
                    as="select"
                    name="difficulty"
                    className="mt-1 w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </Field>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200">Time Limit (sec)</label>
                  <Field
                    type="number"
                    name="timeLimit"
                    className="mt-1 w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <FieldArray name="questions">
              {({ push, remove }) => (
                <div className="space-y-4">
                  {values.questions.map((_: any, index: number) => (
                  <div key={index} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-100">Question {index + 1}</h3>
                    {values.questions.length > 1 && (
                      <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-400 hover:text-red-300"
                      >
                      Remove
                      </button>
                    )}
                    </div>

                    <div className="space-y-4">
                    <Field
                      name={`questions.${index}.title`}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200"
                      placeholder="Question text"
                    />

                    <Field
                      as="select"
                      name={`questions.${index}.type`}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const type = e.target.value as QuestionType;
                      setFieldValue(`questions.${index}.type`, type);
                      setFieldValue(`questions.${index}.answers`, type === 'OPEN' ? [] : ['', '']);
                      setFieldValue(`questions.${index}.correctAnswer`, []);
                      }}
                    >
                      <option value="SINGLE">Single Choice</option>
                      <option value="MULTIPLE">Multiple Choice</option>
                      <option value="OPEN">Open</option>
                    </Field>

                    {values.questions[index].type !== 'OPEN' && (
                      <FieldArray name={`questions.${index}.answers`}>
                        {({ push: pushAnswer, remove: removeAnswer }) => (
                          <div className="space-y-2">
                            {values.questions[index].answers.map((answerText: string, answerIndex:number) => (
                              <div key={answerIndex} className="flex items-center gap-2">
                                <Field
                                  name={`questions.${index}.answers.${answerIndex}`}
                                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200"
                                  placeholder={`Answer ${answerIndex + 1}`}
                                />
                                {values.questions[index].type === 'SINGLE' ? (
                                  <input
                                    type="radio"
                                    value={answerText || ''}  // Ensure empty string instead of null
                                    checked={
                                      Array.isArray(values.questions[index].correctAnswer) &&
                                      values.questions[index].correctAnswer[0] === answerText
                                    }
                                    onChange={() => {
                                      setFieldValue(
                                        `questions.${index}.correctAnswer`,
                                        [answerText || '']  // Ensure empty string instead of null
                                      );
                                    }}
                                    className="form-radio"
                                  />
                                ) : (
                                  <input
                                    type="checkbox"
                                    value={answerText || ''}  // Ensure empty string instead of null
                                    checked={
                                      Array.isArray(values.questions[index].correctAnswer) &&
                                      values.questions[index].correctAnswer.includes(answerText)
                                    }
                                    onChange={(e) => {
                                      const currentCorrect = Array.isArray(values.questions[index].correctAnswer) 
                                        ? values.questions[index].correctAnswer 
                                        : [];
                                      
                                      if (e.target.checked) {
                                        setFieldValue(
                                          `questions.${index}.correctAnswer`,
                                          [...currentCorrect, answerText || '']  // Ensure empty string instead of null
                                        );
                                      } else {
                                        setFieldValue(
                                          `questions.${index}.correctAnswer`,
                                          currentCorrect.filter((a: string) => a !== answerText)
                                        );
                                      }
                                    }}
                                    className="form-checkbox"
                                  />
                                )}
                                {values.questions[index].answers.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeAnswer(answerIndex)}
                                    className="text-red-400"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                            {values.questions[index].answers.length < 6 && (
                              <button
                                type="button"
                                onClick={() => pushAnswer('')}
                                className="text-blue-400"
                              >
                                Add Answer
                              </button>
                            )}
                          </div>
                        )}
                      </FieldArray>
                    )}

                    {values.questions[index].type === 'OPEN' && (
                      <FieldArray name={`questions.${index}.correctAnswer`}>
                      {({ push: pushAnswer, remove: removeAnswer }: { push: (value: string) => void; remove: (index: number) => void; }) => (
                        <div className="space-y-2">
                        {values.questions[index].correctAnswer.map((_: string, answerIndex: number) => (
                          <div key={answerIndex} className="flex items-center gap-2">
                          <Field
                            name={`questions.${index}.correctAnswer.${answerIndex}`}
                            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200"
                            placeholder="Correct answer"
                          />
                          {values.questions[index].correctAnswer.length > 1 && (
                            <button
                            type="button"
                            onClick={() => removeAnswer(answerIndex)}
                            className="text-red-400"
                            >
                            ×
                            </button>
                          )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => pushAnswer('')}
                          className="text-blue-400"
                        >
                          Add Correct Answer
                        </button>
                        </div>
                      )}
                      </FieldArray>
                    )}

                    <ErrorMessage
                      name={`questions.${index}.title`}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                    <ErrorMessage
                      name={`questions.${index}.correctAnswer`}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                    </div>
                  </div>
                  ))}
                  <button
                  type="button"
                  onClick={() => push(initialQuestionState)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                  Add Question
                  </button>
                </div>
              )}
            </FieldArray>

            <button
              type="submit"
              className="w-full bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 font-medium"
            >
              {isEditing ? 'Save Changes' : 'Create Quiz'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}