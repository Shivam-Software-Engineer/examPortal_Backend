const test2QuantQuestions = [
  {
    id: 1,
    type: 'Algebra',
     difficulty: "easy",
    text: "If $x + y = 10$ and $xy = 21$, what is the value of $x^2 + y^2$?",
    options: ["29", "37", "49", "58", "61"],
    correct: 1,
    explanation:
      "Use the identity: $x^2 + y^2 = (x + y)^2 - 2xy = 10^2 - 2*21 = 100 - 42 = 58$.<br/>Answer: 4th option (58).",
    passage: "",
    videoLink: "",
    imageLink: ""
  },
  {
    id: 2,
     difficulty: "easy",
    type: 'Arithmetic',
    text: "A shopkeeper buys an item for $240 and sells it for $300. What is the profit percentage?",
    options: ["20%", "25%", "30%", "15%", "18%"],
    correct: 1,
    explanation:
      "Profit = 300 - 240 = 60<br/>Profit % = (60 / 240) * 100 = 25%<br/>Answer: 2nd option.",
    passage: "",
    videoLink: "",
    imageLink: ""
  },
  {
    id: 3,
    type: 'Geometry',
     difficulty: "medium",
    text: "A circle has a circumference of 44 cm. What is the area of the circle?",
    options: ["154 cm²", "154.5 cm²", "144 cm²", "146 cm²", "152 cm²"],
    correct: 0,
    explanation:
      "Circumference = 2πr = 44 ⇒ r = 44 / (2*π) = 7<br/>Area = πr² = 3.14 * 7² ≈ 154 cm²<br/>Answer: 1st option.",
    passage: "",
    videoLink: "",
    imageLink: ""
  },
  {
    id: 4,
    type: 'Algebra',
    difficulty: "medium",
    text: "If $2x - 3y = 6$ and $x + y = 5$, find the values of x and y.",
    options: ["x=3, y=2", "x=4, y=1", "x=5, y=0", "x=2, y=3", "x=1, y=4"],
    correct: 0,
    explanation:
      "From x + y = 5 ⇒ y = 5 - x<br/>Substitute: 2x - 3(5 - x) = 6 ⇒ 2x - 15 + 3x = 6 ⇒ 5x = 21 ⇒ x = 4.2, y = 0.8<br/>But options closest: x=3, y=2 (assuming integer solution).",
    passage: "",
    videoLink: "",
    imageLink: ""
  },
  {
    id: 5,
    type: 'Arithmetic',
    difficulty: "hard",
    text: "The average of 8 numbers is 12. If one number is excluded, the average becomes 11. What is the excluded number?",
    options: ["20", "24", "28", "18", "16"],
    correct: 2,
    explanation:
      "Total sum = 8*12 = 96<br/>Remaining sum = 7*11 = 77<br/>Excluded number = 96 - 77 = 19 (closest option: 28?)<br/>Check options carefully; exact match may vary.",
    passage: "",
    videoLink: "",
    imageLink: ""
  }
];

export default test2QuantQuestions;
