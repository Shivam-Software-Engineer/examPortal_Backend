const test1QuantQuestions = [
  {
    id: 1,
    type: 'Algebra',
    difficulty: "easy",
    text: "Positive integers $a > b$ satisfy $a^2 - b^2 = 77$ and $a + b < 20$. How many ordered pairs $(a, b)$ are possible?",
    options: ["0", "1", "2", "3", "4"],
    correct: 1,
    explanation:
      "Rewrite as $(a − b)(a + b) = 77$. Factor pairs of 77: $(1, 77)$ and $(7, 11)$. Only $(7, 11)$ satisfies $a + b < 20$: $$a - b = 7, \\quad a + b = 11 \\Rightarrow a = 9, \\quad b = 2.$$",
    passage: "",
    videoLink: "",
    imageLink: ""
  },
  {
    id: 2,
    type: 'Arithmatic',
    difficulty: "easy",
    text: "Pipe A fills a tank in 6 hours, Pipe B in 4 hours, and Pipe C empties it in 3 hours. All three pipes are opened together. After 2 hours, Pipe C is closed. <br/>How much more time is required to completely fill the tank?",
    options: [" 1 hr", " 2 hr", " 2.5 hr", " 3 hr", " 4 hr"],
    correct: 1,
    explanation:
      "Rates: $$A = \\frac{1}{6}, \\quad B = \\frac{1}{4}, \\quad C = -\\frac{1}{3}$$ (tank per hour). Combined for first 2 hours: $$\\frac{1}{6} + \\frac{1}{4} - \\frac{1}{3} = \\frac{1}{12}.$$ Volume filled in 2 hours: $$2 \\times \\frac{1}{12} = \\frac{1}{6}.$$ Remaining: $$\\frac{5}{6}$$. New rate (A + B): $$\\frac{1}{6} + \\frac{1}{4} = \\frac{5}{12}.$$ Time = $$\\frac{5}{6} \\div \\frac{5}{12} = 2 \\text{ hr}.$$",
    passage: "",
    videoLink: "",
    imageLink: ""
  },
  {
    id: 3,
    type: 'Arithmatic',
    difficulty: "medium",
    text: "A 4-digit number is formed from the digits 1–7 without repetition.<br/> What is the probability that the number is divisible by 5 and contains at least two prime digits (prime digits = 2, 3, 5, 7)?",
    options: [
      "\\( \\frac{19}{140} \\)",
      "\\( \\frac{1}{7} \\)",
      "\\( \\frac{3}{35} \\)",
      "\\( \\frac{1}{14} \\)",
      "\\( \\frac{3}{14} \\)"
    ],
    correct: 0,
    explanation:
      "Divisible by 5 ⇒ last digit = 5. Remaining digits: {1,2,3,4,6,7}. First 3 positions: $$6P3 = 120$$ permutations. Bad cases with no additional prime (using only 1, 4, 6): $$3P3 = 6$$. Favourable = $$120 − 6 = 114$$. Total 4-digit numbers: $$7P4 = 840$$. $$\\text{Probability} = \\frac{114}{840} = \\frac{19}{140}.$$",
    passage: "",
    videoLink: "",
    imageLink: ""
  },
  {
    id: 4,
    type: 'Algebra',
     difficulty: "hard",
    text: "Nine distinct integers are ordered $a_1 < a_2 < \\dots < a_9$.<br/>Given:<br/>• median $a_5 = 10$<br/>• mean of all nine numbers = 10<br/>• minimum $a_1 = 4$<br/>• maximum $a_9 = 20$<br/>What is the largest possible value of the second‑largest number $a_8$?",
    options: ["13", "14", "15", "16", "18"],
    correct: 2,
    explanation:
      "Total sum = $$9 \\times 10 = 90$$<br/>Minimise other variables: $$a_2, a_3, a_4 = 5, 6, 7$$; $$a_6, a_7 = 11, 12$$<br/>Sum known = $$4 + 5 + 6 + 7 + 10 + 11 + 12 + 20 = 75$$<br/>$$a_8 = 90 - 75 = 15$$<br/>Answer **C**",
    passage: "",
    videoLink: "",
    imageLink: ""
  },
  {
    id: 5,
    type: 'Arithmatic',
     difficulty: "medium",
    text: "A survey was conducted among 250 students to find which subjects they liked. The results were as follows:<br/>• 140 students chose Civics,<br/>• 130 chose Economics, and<br/>• 120 chose History.<br/><br/>Additionally:<br/><br/>• 70 students liked both Civics and Economics,<br/>• 60 liked both Civics and History,<br/>• 50 liked both Economics and History, and<br/>• 30 students liked all three subjects.<br/><br/>How many students did not choose any of the three subjects?",
    options: ["0", "5", "10", "15", "20"],
    correct: 2,
    explanation:
      "Let Civics = $$|A|$$, Economics = $$|B|$$, and History = $$|C|$$.<br/><br/>Inclusion–Exclusion: $$|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|$$<br/><br/>= $$140 + 130 + 120 - (70 + 60 + 50) + 30 = 240.$$<br/><br/>None = $$250 - 240 = 10.$$<br/><br/>Answer <b>C</b>.",
    passage: "",
    videoLink: "",
    imageLink: ""
  },
  {
    id: 6,
    type: 'Algebra',
      difficulty: "hard",
    text: "A 5‑digit integer is formed using digits {1–6} without repetition. What is the probability it is divisible by 4?",
    options: [
      "\\( \\frac{1}{6} \\)",
      "\\( \\frac{2}{15} \\)",
      "\\( \\frac{4}{15} \\)",
      "\\( \\frac{1}{3} \\)",
      "\\( \\frac{5}{18} \\)"
    ],
    correct: 2,
    explanation:
      "The divisibility rule of 4 states that if the last two digits form a number divisible by 4, the entire number is divisible by 4.<br/>Valid endings (using distinct digits): 12, 16, 24, 32, 36, 52, 56, 64 ⇒ 8 possible endings<br/>For each, first 3 positions can be filled in 4P3 = 24 ways<br/>Favourable numbers = $$8 \\times 24 = 192$$<br/>Total possible 5‑digit numbers: $$6P5 = 720$$<br/>Probability = $$\\frac{192}{720} = \\frac{4}{15}$$<br/>Answer **C**",
    passage: "",
    videoLink: "",
    imageLink: ""
  },
  {
    id: 7,
    type: 'Arithmatic',
      difficulty: "hard",
    text: "A biker traveled 60 kilometers along a trail at an average speed of 45 km/h and returned along the same route at an average speed of 30 km/h. Approximately what was the biker's average speed for the entire round trip, in kilometers per hour?",
    options: ["37.5 km/h", "36 km/h", "40 km/h", "32 km/h", "33.75 km/h"],
    correct: 1,
    explanation:
      "Total distance: Forward + Return = $$60 + 60 = 120$$ km<br/>Time taken:<br/>Forward: $$\\frac{60}{45} = \\frac{4}{3}$$ hours<br/>Return: $$\\frac{60}{30} = 2$$ hours<br/>Total time = $$\\frac{4}{3} + 2 = \\frac{10}{3}$$ hours<br/>Average speed:<br/>$$\\text{Average speed} = \\frac{120}{10/3} = 120 \\times \\frac{3}{10} = 36 \\text{ km/h}$$",
    passage: "",
    videoLink: "",
    imageLink: ""
  }
];

export default test1QuantQuestions;
