const test1DataInsightsQuestions = [
  // ===== Question 1 =====
  {
    id: 1,
    type: "GraphicsInterpretation",
    difficulty: "hard",
    passage:
      "The pie chart and bar graph below were created independently by two individuals. Both graphs represent the same collection of 72,000 books. However, the individuals grouped some of the books differently—some books have been placed in different categories.",
    imageLink: ["https://gmat.maxiwiselearning.com/pie.png", "https://gmat.maxiwiselearning.com/graph.png"],
    instructions:
      "Select from each drop-down menu the option that creates the most accurate statement.",
   
    videoLink: "",
    
    
    prompts: [
      {
        statement:
          "(i) It can be inferred from the information provided that the category of _____ in the bar graph included books that are not classified the same in the circle graph.",
        options: ["Romance", "Fantasy", "History", "Mystery"],
        
        
        explanation:
          "The bar graph 'History' category has 9,000 books while the circle chart shows 7,200 books. Some books are classified differently."
      },
      {
        statement:
          "(ii) It can be inferred from the information provided that the category of _____ in the circle graph included books that are not classified the same in the bar graph.",
        options: ["Fantasy", "History", "Comedy", "Mystery"],
        
        
        explanation:
          "The circle graph 'Comedy' shows 10,800 books while the bar graph shows 10,000 books. Some books are classified differently."
      }
    ],
    correct: {0:2, 1:2},
    correctAnswer: ["History", "Comedy"],
    chartDescription:
      "Line graph showing steady growth from Q1 2020 ($3.1M) to Q3 2021 ($4.4M) with seasonal spikes in Q4 each year."
  },

  // ===== Question 2 =====
  {
    id: 2,
    type: "TwoPartAnalysis",
    difficulty: "medium",
    passage:
      "A startup has 80 employees, each working in exactly one of the company’s three teams: Engineering, Marketing, or Design. 25% of the employees work in Marketing. 10 more people work in Engineering than in Design.",
    instructions:
      "Select the number of employees in Design and Engineering teams. Make two selections, one per column.",
    tableHeadings: {
      column1: "Engineering",
      column2: "Design"
    },
    passage: "",
    videoLink: "",
    imageLink: "",
    options: [15, 20, 25, 30, 35],
    correct: [4, 2],
    correctAnswer: [35, 25],
    explanation: `
      <p><strong>Total employees:</strong> 80</p>
      <p><strong>Marketing employees:</strong> \\( 25\\% \\times 80 = 20 \\)</p>
      <p><strong>Remaining employees (Engineering + Design):</strong> \\( 80 - 20 = 60 \\)</p>
      <p>Let the number of employees in <strong>Design = \\( x \\)</strong>. Then, number in <strong>Engineering = \\( x + 10 \\)</strong>.</p>
      <p>Forming the equation:</p>
      <p>\\( x + (x + 10) = 60 \\)</p>
      <p>\\( 2x + 10 = 60 \\)</p>
      <p>\\( 2x = 50 \\)</p>
      <p>\\( x = 25 \\)</p>
      <p><strong>Therefore:</strong></p>
      <ul>
        <li>Design = 25</li>
        <li>Engineering = \\( 25 + 10 = 35 \\)</li>
      </ul>
      <p><strong>Correct selections:</strong></p>
      <ul>
        <li>Engineering: 35</li>
        <li>Design: 25</li>
      </ul>
    `
  },

  // ===== Question 3 =====
  {
    id: 3,
    type: "DataSufficiency",
    difficulty: "medium",
    text:
      "A coin collection of 900 coins is made up of twice as many bronze coins as silver coins. The total appraised value is $720.",
    instructions: [
      "Each bronze coin is worth $0.30 more than each silver coin.",
      "The average value of a bronze coin and a silver coin is $0.75."
    ],
    options: [
      "Statement (1) ALONE is sufficient, but statement (2) alone is not sufficient.",
      "Statement (2) ALONE is sufficient, but statement (1) alone is not sufficient.",
      "BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient.",
      "EACH statement ALONE is sufficient.",
      "Statements (1) and (2) TOGETHER are NOT sufficient."
    ],
    correct: 3,
    correctAnswer: "EACH statement ALONE is sufficient.",
    passage: "",
    videoLink: "",
    imageLink: "",
    explanation: `
      <p>The number of the bronze coins = \\( n_b \\)</p>
      <p>The number of the silver coins = \\( n_s \\)</p>
      <p>Since there are twice as many bronze coins as silver coins,</p>
      <p>\\( n_b = 2 n_s \\)</p>

      <p>Since total coins are 900, \\( n_b + n_s = 900 \\)</p>
      <p>\\( 2 n_s + n_s = 900 \\)</p>
      <p>\\( 3 n_s = 900 \\)</p>
      <p>\\( n_s = 300 \\)</p>
      <p>\\( n_b = 600 \\)</p>

      <p>Let the appraised value of one bronze coin = \\( v_b \\)</p>
      <p>Appraised value of one silver coin = \\( v_s \\)</p>

      <p>If the total appraised value is \\( 720 \\),</p>
      <p>\\( n_b v_b + n_s v_s = 720 \\)</p>
      <p>\\( 600 v_b + 300 v_s = 720 \\)</p>
      <p>\\( 10 v_b + 5 v_s = 12 \\)</p>

      <p>\\( 600 v_b = \\ ? \\)</p>

      <h4>Statement 1:</h4>
      <p>(1) Each bronze coin is worth \\$0.30 more than each silver coin.</p>
      <p>\\( v_b = 0.30 + v_s \\)</p>
      <p>Substituting this into \\( 10 v_b + 5 v_s = 12 \\)</p>
      <p>\\( 10 (0.30 + v_s) + 5 v_s = 12 \\)</p>
      <p>\\( 3 + 10 v_s + 5 v_s = 12 \\)</p>
      <p>\\( 15 v_s = 9 \\)</p>
      <p>\\( v_s = 0.6 \\)</p>
      <p>\\( v_b = 0.9 \\)</p>

      <p>So, \\( 600 v_b = 600 \\times 0.9 = 540 \\)</p>

      <p><strong>Hence, this statement alone is sufficient. Eliminate B, C, and E.</strong></p>

      <h4>Statement 2:</h4>
      <p>(2) The average value of a bronze coin and a silver coin is \\$0.75.</p>
      <p>\\( \\frac{v_b + v_s}{2} = 0.75 \\)</p>
      <p>\\( v_b + v_s = 1.5 \\)</p>
      <p>\\( v_b = 1.5 - v_s \\)</p>
      <p>Substituting this into \\( 10 v_b + 5 v_s = 12 \\)</p>
      <p>\\( 10 (1.5 - v_s) + 5 v_s = 12 \\)</p>
      <p>\\( 15 - 10 v_s + 5 v_s = 12 \\)</p>
      <p>\\( 3 = 5 v_s \\)</p>
      <p>\\( v_s = 0.6 \\)</p>
      <p>\\( v_b = 0.9 \\)</p>
      <p>So, \\( 600 v_b = 600 \\times 0.9 = 540 \\)</p>
      <p><strong>Hence, this statement alone is sufficient.</strong></p>
      <p><strong>So, the answer is EACH statement ALONE is sufficient.</strong></p>
    `
  },

  // ===== Question 4 =====
  {
    id: 4,
    type: "TableAnalysis",
    difficulty: "hard",
    text:
      "Liam is choosing a treadmill and has shortlisted seven models. Requirements:",
    instructions:
      "1. Minimum speed ≥ 5 km/h  2. Maximum speed ≤ 15 km/h. Select Yes/No for each statement.",
      passage: "",
    videoLink: "",
    imageLink: "",
    tableData: {
      headers: ["Treadmill", "Min Speed (km/h)", "Max Speed (km/h)"],
      rows: [
        ["M1", 4.8, 14.9],
        ["M2", 5.2, 14.2],
        ["M3", 6.0, 14.5],
        ["M4", 5.5, 15.0],
        ["M5", 4.5, 14.8],
        ["M6", 5.1, 14.6],
        ["M7", 5.3, 16.0]
      ]
    },
    prompts: [
      { statement: "At least 4 treadmills satisfy Requirement 1.", options: ["Yes","No"], correct: 0, correctAnswer:"Yes" },
      { statement: "At least 4 treadmills satisfy Requirement 2.", options: ["Yes","No"], correct: 0, correctAnswer:"Yes" },
      { statement: "Only treadmills satisfy both requirements.", options: ["Yes","No"], correct: 1, correctAnswer:"No",
        explanation: "Requirement 1: 5 satisfy, Requirement 2: 5 satisfy, Both: 3 satisfy" }
    ],
    correct: {0:0,1:0,2:1}
  },

  // ===== Question 5 =====
  {
    id: 5,
    type: "MultiSourceReasoning",
    difficulty: "medium",
    text: "Parcel tagging system proposals",
    tabs: {
      "Proposal 1": "<p>To comply with new regulations around protecting personal information, a parcel delivery company must redesign the way it assigns identification tags to customer records in its system.</p><p>The company is considering new proposals that must meet all of the following conditions:</p><ul><li><strong>Database Constraints:</strong> Each character in the tag must be from the following <strong>symbols and numbers only</strong> (no letters allowed):<br><code>! @ # $ % ^ & * ( ) - _ + = &lt; &gt; ? / 0 1 2 3 4 5 6 7 8 9</code></li><li><strong>Error Checking:</strong> There must be a simple method to determine whether a tag could be valid, even without querying the system.</li><li><strong>Meaningful:</strong> Each tag must encode some actual information about the customer or the parcel delivery (such as time, region, or parcel type).</li></ul><p>All previously stored customer records will also be updated using whichever tagging system is selected.</p>",
      "Proposal 2": "<p>Each tag has 3 parts:</p><ol><li><strong>Order Time</strong><br>Use 2-digit hour (00–23) followed by 2-digit minutes (00–59), using only numerals.<br><strong>&rarr; Example:</strong> 1342 for 1:42 PM</li><li><strong>Parcel Type Code</strong><br>Choose from the approved symbol pairs:<br><ul><li>Fragile &rarr; <code>@%</code></li><li>Oversized &rarr; <code>^&amp;</code></li><li>Standard &rarr; <code>$*</code></li><li>Express &rarr; <code>&gt;&lt;</code></li></ul></li><li><strong>Validity Marker</strong><br>Add the numeric digits in the tag. If the sum is divisible by 3, append <code>=</code>, else append <code>?</code>.<br><strong>&rarr; Example:</strong> For <code>1342$*</code>, digit sum = 1+3+4+2 = 10 → not divisible by 3 → tag ends with <code>?</code><br><strong>&#9989; Final Tag:</strong> <code>1342$*?</code></li></ol>",
      "Proposal 3": "<p>Each tag has 3 parts:</p><ol><li><strong>Delivery Region</strong><br>Use symbol pairs:<br><ul><li>North &rarr; <code>!@</code></li><li>South &rarr; <code>#$</code></li><li>East &rarr; <code>%^</code></li><li>West &rarr; <code>&amp;*</code></li></ul></li><li><strong>Delivery Date (Day only)</strong><br>2-digit day of the month (e.g., <code>01</code> for 1st, <code>15</code> for 15th)</li><li><strong>Time Slot Marker</strong><br><ul><li>Morning &rarr; <code>+</code></li><li>Afternoon &rarr; <code>=</code></li><li>Evening &rarr; <code>/</code></li><li>Night &rarr; <code>?</code></li></ul><strong>&rarr; Example:</strong> South region, delivery on 15th, afternoon slot &rarr; <code>#$15=</code></li></ol>"
    },
    passage: "",
    videoLink: "",
    imageLink: "",
    prompts: [
      {
        type: "table",
        statement: "Select 'Explicitly mentioned in Proposal 1' if principle is in Proposal 1.",
        rows: [
          { statement: "Database Constraints", options: ["Yes","No"], correct:0, correctAnswer:"Yes" },
          { statement: "Error Checking", options: ["Yes","No"], correct:0, correctAnswer:"Yes" },
          { statement: "Meaningful", options: ["Yes","No"], correct:0, correctAnswer:"Yes" }
        ],
        
      }
    ],
    explanation: "<ul>" +
        "<li><strong>Database Constraints:</strong> Proposal 1 uses only allowed symbols and numbers — as explicitly mentioned in the proposal’s list of permitted characters.</li>" +
        "<li><strong>Error Checking:</strong> Proposal 1 requires a simple method to verify whether a tag could be valid without querying the system, satisfying this principle.</li>" +
        "<li><strong>Meaningful:</strong> Proposal 1 mandates that each tag encodes actual customer or delivery information like time, region, or parcel type — hence fulfilling this requirement as well.</li>" +
        "</ul>",
    correct: {0:0,1:0,2:0},
    correctAnswer: ["Yes","Yes","Yes"]
  },

  // ===== Question 6 =====
  {
    id: 6,
    type: "MultiSourceReasoning",
    difficulty: "hard",
    text: "Suppose Proposal 2 is adopted. Determine tag validity.",
    tabs: {
     "Proposal 1": "<p>To comply with new regulations around protecting personal information, a parcel delivery company must redesign the way it assigns identification tags to customer records in its system.</p><p>The company is considering new proposals that must meet all of the following conditions:</p><ul><li><strong>Database Constraints:</strong> Each character in the tag must be from the following <strong>symbols and numbers only</strong> (no letters allowed):<br><code>! @ # $ % ^ & * ( ) - _ + = &lt; &gt; ? / 0 1 2 3 4 5 6 7 8 9</code></li><li><strong>Error Checking:</strong> There must be a simple method to determine whether a tag could be valid, even without querying the system.</li><li><strong>Meaningful:</strong> Each tag must encode some actual information about the customer or the parcel delivery (such as time, region, or parcel type).</li></ul><p>All previously stored customer records will also be updated using whichever tagging system is selected.</p>",
      "Proposal 2": "<p>Each tag has 3 parts:</p><ol><li><strong>Order Time</strong><br>Use 2-digit hour (00–23) followed by 2-digit minutes (00–59), using only numerals.<br><strong>&rarr; Example:</strong> 1342 for 1:42 PM</li><li><strong>Parcel Type Code</strong><br>Choose from the approved symbol pairs:<br><ul><li>Fragile &rarr; <code>@%</code></li><li>Oversized &rarr; <code>^&amp;</code></li><li>Standard &rarr; <code>$*</code></li><li>Express &rarr; <code>&gt;&lt;</code></li></ul></li><li><strong>Validity Marker</strong><br>Add the numeric digits in the tag. If the sum is divisible by 3, append <code>=</code>, else append <code>?</code>.<br><strong>&rarr; Example:</strong> For <code>1342$*</code>, digit sum = 1+3+4+2 = 10 → not divisible by 3 → tag ends with <code>?</code><br><strong>&#9989; Final Tag:</strong> <code>1342$*?</code></li></ol>",
      "Proposal 3": "<p>Each tag has 3 parts:</p><ol><li><strong>Delivery Region</strong><br>Use symbol pairs:<br><ul><li>North &rarr; <code>!@</code></li><li>South &rarr; <code>#$</code></li><li>East &rarr; <code>%^</code></li><li>West &rarr; <code>&amp;*</code></li></ul></li><li><strong>Delivery Date (Day only)</strong><br>2-digit day of the month (e.g., <code>01</code> for 1st, <code>15</code> for 15th)</li><li><strong>Time Slot Marker</strong><br><ul><li>Morning &rarr; <code>+</code></li><li>Afternoon &rarr; <code>=</code></li><li>Evening &rarr; <code>/</code></li><li>Night &rarr; <code>?</code></li></ul><strong>&rarr; Example:</strong> South region, delivery on 15th, afternoon slot &rarr; <code>#$15=</code></li></ol>"
     },
    passage: "",
    videoLink: "",
    imageLink: "",
    prompts: [
      {
        type: "table",
        statement: "Select 'Could be true' or 'Could not be true' for tags.",
        rows: [
          { statement: "Tag @!30+ → North region, 30th, morning.", options:["Yes","No"], correct:1, correctAnswer:"No" },
          { statement: "Tag &*02/ → West region, 2nd, evening.", options:["Yes","No"], correct:0, correctAnswer:"Yes" },
          { statement: "Tag #$5= → South, 5th, afternoon.", options:["Yes","No"], correct:1, correctAnswer:"No" }
        ],
       
      }
    ],
    explanation: "<ul>" +
        "<li><strong>@!30+ :</strong> North region should use <code>!@</code>, but the tag has <code>@!</code> (order mismatch). Therefore, this tag <strong>Could not be true</strong>.</li>" +
        "<li><strong>&02/ :</strong> West region uses <code>&*</code> (match), Delivery date is <code>02</code> (correct), Evening slot uses <code>/</code> (correct). Therefore, this tag <strong>Could be true</strong>.</li>" +
        "<li><strong>#$=5 :</strong> South region uses <code>#$</code> (match), Delivery date should be <code>05</code> for the 5th, but only has <code>5</code> (incorrect format), Afternoon slot uses <code>=</code> (match). Because of the incomplete delivery date, this tag <strong>Could not be true</strong>.</li>" +
        "</ul>",
    correct: {0:1,1:0,2:1},
    correctAnswer: ["No","Yes","No"]
  },

  // ===== Question 7 =====
  {
    id: 7,
    type: "MultiSourceReasoning",
    difficulty: "hard",
    text: "How many different 5-character tags are possible under Proposal 3?",
    tabs: {
     "Proposal 1": "<p>To comply with new regulations around protecting personal information, a parcel delivery company must redesign the way it assigns identification tags to customer records in its system.</p><p>The company is considering new proposals that must meet all of the following conditions:</p><ul><li><strong>Database Constraints:</strong> Each character in the tag must be from the following <strong>symbols and numbers only</strong> (no letters allowed):<br><code>! @ # $ % ^ & * ( ) - _ + = &lt; &gt; ? / 0 1 2 3 4 5 6 7 8 9</code></li><li><strong>Error Checking:</strong> There must be a simple method to determine whether a tag could be valid, even without querying the system.</li><li><strong>Meaningful:</strong> Each tag must encode some actual information about the customer or the parcel delivery (such as time, region, or parcel type).</li></ul><p>All previously stored customer records will also be updated using whichever tagging system is selected.</p>",
      "Proposal 2": "<p>Each tag has 3 parts:</p><ol><li><strong>Order Time</strong><br>Use 2-digit hour (00–23) followed by 2-digit minutes (00–59), using only numerals.<br><strong>&rarr; Example:</strong> 1342 for 1:42 PM</li><li><strong>Parcel Type Code</strong><br>Choose from the approved symbol pairs:<br><ul><li>Fragile &rarr; <code>@%</code></li><li>Oversized &rarr; <code>^&amp;</code></li><li>Standard &rarr; <code>$*</code></li><li>Express &rarr; <code>&gt;&lt;</code></li></ul></li><li><strong>Validity Marker</strong><br>Add the numeric digits in the tag. If the sum is divisible by 3, append <code>=</code>, else append <code>?</code>.<br><strong>&rarr; Example:</strong> For <code>1342$*</code>, digit sum = 1+3+4+2 = 10 → not divisible by 3 → tag ends with <code>?</code><br><strong>&#9989; Final Tag:</strong> <code>1342$*?</code></li></ol>",
      "Proposal 3": "<p>Each tag has 3 parts:</p><ol><li><strong>Delivery Region</strong><br>Use symbol pairs:<br><ul><li>North &rarr; <code>!@</code></li><li>South &rarr; <code>#$</code></li><li>East &rarr; <code>%^</code></li><li>West &rarr; <code>&amp;*</code></li></ul></li><li><strong>Delivery Date (Day only)</strong><br>2-digit day of the month (e.g., <code>01</code> for 1st, <code>15</code> for 15th)</li><li><strong>Time Slot Marker</strong><br><ul><li>Morning &rarr; <code>+</code></li><li>Afternoon &rarr; <code>=</code></li><li>Evening &rarr; <code>/</code></li><li>Night &rarr; <code>?</code></li></ul><strong>&rarr; Example:</strong> South region, delivery on 15th, afternoon slot &rarr; <code>#$15=</code></li></ol>"
      },
    passage: "",
    videoLink: "",
    imageLink: "",   
    instructions: "Choose the correct number of tag combinations.",
    options: ["124","248","496","512","620"],
    correct: 2,
    explanation: "4 regions × 31 days × 4 time markers = 496 possible tags."
      
  }
];

export default test1DataInsightsQuestions;
