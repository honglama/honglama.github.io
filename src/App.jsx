// import './App.css';

import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const CalculatorContainer = styled.div`
  margin: 0 auto;
  width: 24rem;
  background-color: rgb(31, 41, 55);
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 
              0 8px 10px -6px rgb(0 0 0 / 0.1);
`;

const Display = styled.div`
  background-color: rgb(229, 231, 235);
  padding: 1rem;
  margin-bottom: 1rem;
  min-height: 8rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow-x: auto;
`;

const MonoText = styled.div`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  width: 100%;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  width: 100%;
`;

const InputBox = styled.div`
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: ${props => props.active ? '2px solid rgb(59, 130, 246)' : '1px solid rgb(156, 163, 175)'};
`;

const ResultAlert = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  text-align: center;
  color: white;
  background-color: ${props => props.success ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'};
`;

const Keypad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 1rem;
  font-size: 1.25rem;
  border-radius: 0.375rem;
  color: white;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
  grid-column: ${props => props.enter ? 'span 3' : 'span 1'};

  ${props => {
    switch(props.type) {
      case 'number':
        return `
          background-color: rgb(75, 85, 99);
          &:hover { background-color: rgb(55, 65, 81); }
        `;
      case 'enter':
        return `
          background-color: rgb(59, 130, 246);
          &:hover { background-color: rgb(37, 99, 235); }
        `;
      case 'clear':
        return `
          background-color: rgb(239, 68, 68);
          &:hover { background-color: rgb(220, 38, 38); }
        `;
      case 'backspace':
        return `
          background-color: rgb(234, 179, 8);
          &:hover { background-color: rgb(202, 138, 4); }
        `;
      default:
        return '';
    }
  }}
`;

const AnswerText = styled.div`
  font-size: 0.875rem;
  color: rgb(22, 163, 74);
  text-align: right;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProblemText = styled.div`
  font-size: 1.125rem;
  line-height: 1.75rem;
`;


const SumContainer = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: ${props => props.active ? '2px solid rgb(59, 130, 246)' : '1px solid rgb(156, 163, 175)'};
`;

const SumLabel = styled.div`
  font-size: 0.875rem;
  color: rgb(107, 114, 128);
  margin-bottom: 0.5rem;
`;

const CalculatorGame = () => {
  const [number, setNumber] = useState('');
  const [mode, setMode] = useState('input');
  const [currentBox, setCurrentBox] = useState(0);
  const [answers, setAnswers] = useState(['', '', '']);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sumMode, setSumMode] = useState(false);
  const [sumAnswer, setSumAnswer] = useState('');

  const generateEquation = (num) => {
    const n = parseInt(num);
    if (isNaN(n) || n < 10 || n > 99) return null;

    const tens = Math.floor(n / 10) * 10;
    const ones = n % 10;
    return {
      original: n * n,
      parts: [
        tens * tens,
        tens * ones * 2,
        ones * ones
      ]
    };
  };

  const handleNumberClick = (num) => {
    if (mode === 'input') {
      if (number.length < 2) {
        const newNumber = number + num;
        setNumber(newNumber);
      }
    } else if (sumMode) {
      setSumAnswer(sumAnswer + num);
    } else {
      const newAnswers = [...answers];
      newAnswers[currentBox] = newAnswers[currentBox] + num;
      setAnswers(newAnswers);
    }
  };

  const handleBackspace = () => {
    if (mode === 'input') {
      setNumber(number.slice(0, -1));
    } else if (sumMode) {
      setSumAnswer(sumAnswer.slice(0, -1));
    } else {
      const newAnswers = [...answers];
      newAnswers[currentBox] = newAnswers[currentBox].slice(0, -1);
      setAnswers(newAnswers);
    }
  };

  const handleEnter = () => {
    if (mode === 'input') {
      const equation = generateEquation(number);
      if (equation) {
        setMode('answer');
        setAnswers(['', '', '']);
        setWrongAttempts(0);
        setShowAnswer(false);
        setSumMode(false);
        setSumAnswer('');
      }
    } else if (sumMode) {
      const equation = generateEquation(number);
      if (equation) {
        const totalSum = equation.parts.reduce((a, b) => a + b, 0);
        const userSum = parseInt(sumAnswer) || 0;
        const correct = totalSum === userSum;
        
        setIsCorrect(correct);
        setShowResult(true);
        
        if (!correct) {
          const newWrongAttempts = wrongAttempts + 1;
          setWrongAttempts(newWrongAttempts);
          if (newWrongAttempts >= 3) {
            setShowAnswer(true);
          }
        }
        
        setTimeout(() => {
          setShowResult(false);
          if (correct) {
            // 모든 단계가 완료되면 초기 상태로 리셋
            setMode('input');
            setNumber('');
            setAnswers(['', '', '']);
            setCurrentBox(0);
            setWrongAttempts(0);
            setShowAnswer(false);
            setSumMode(false);
            setSumAnswer('');
          }
        }, 1000);
      }
    } else {
      const equation = generateEquation(number);
      if (equation) {
        const userAnswers = answers.map(a => parseInt(a) || 0);
        const correct = equation.parts[currentBox] === userAnswers[currentBox];
        setIsCorrect(correct);
        setShowResult(true);
        
        if (!correct) {
          const newWrongAttempts = wrongAttempts + 1;
          setWrongAttempts(newWrongAttempts);
          if (newWrongAttempts >= 3) {
            setShowAnswer(true);
          }
        }
        
        setTimeout(() => {
          setShowResult(false);
          if (correct) {
            if (currentBox < 2) {
              setCurrentBox(currentBox + 1);
              setWrongAttempts(0);
              setShowAnswer(false);
            } else {
              // 모든 부분값을 맞췄을 때 합계 모드로 전환
              setSumMode(true);
              setWrongAttempts(0);
              setShowAnswer(false);
            }
          }
        }, 1000);
      }
    }
  };

  const handleClear = () => {
    if (mode === 'input') {
      setNumber('');
    } else if (sumMode) {
      setSumAnswer('');
    } else {
      const newAnswers = [...answers];
      newAnswers[currentBox] = '';
      setAnswers(newAnswers);
    }
  };

  const renderDisplay = () => {
    if (mode === 'input') {
      return number || '0';
    } else {
      const tens = Math.floor(parseInt(number) / 10) * 10;
      const ones = parseInt(number) % 10;
      return (
        <FlexColumn>
          <ProblemText>
            {number} × {number} =
          </ProblemText>
          <InputGrid>
            <InputBox active={!sumMode && currentBox === 0}>
              {answers[0] || `(${tens}×${tens})`}
            </InputBox>
            <InputBox active={!sumMode && currentBox === 1}>
              {answers[1] || `(${tens}×${ones}×2)`}
            </InputBox>
            <InputBox active={!sumMode && currentBox === 2}>
              {answers[2] || `(${ones}×${ones})`}
            </InputBox>
          </InputGrid>
          {!sumMode && showAnswer && (
            <AnswerText>
              정답: {generateEquation(number)?.parts[currentBox]}
            </AnswerText>
          )}
          {sumMode && (
            <SumContainer active={true}>
              <SumLabel>세 값의 합을 입력하세요:</SumLabel>
              {sumAnswer || '0'}
              {showAnswer && (
                <AnswerText>
                  정답: {generateEquation(number)?.parts.reduce((a, b) => a + b, 0)}
                </AnswerText>
              )}
            </SumContainer>
          )}
        </FlexColumn>
      );
    }
  };

  const buttons = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    '0', 'C', '⌫',
    '='
  ];

  return (
    <CalculatorContainer>
      <Display>
        <MonoText>
          {renderDisplay()}
        </MonoText>
      </Display>

      {showResult && (
        <ResultAlert success={isCorrect}>
          {isCorrect ? 'Great!' : `Try again! (${wrongAttempts}/3)`}
        </ResultAlert>
      )}

      <Keypad>
        {buttons.map((btn) => (
          <Button
            key={btn}
            onClick={() => {
              if (btn === 'C') handleClear();
              else if (btn === '=') handleEnter();
              else if (btn === '⌫') handleBackspace();
              else handleNumberClick(btn);
            }}
            type={
              btn === '=' ? 'enter' :
              btn === 'C' ? 'clear' :
              btn === '⌫' ? 'backspace' :
              'number'
            }
            enter={btn === '='}
          >
            {btn}
          </Button>
        ))}
      </Keypad>
    </CalculatorContainer>
  );
};

export default CalculatorGame;