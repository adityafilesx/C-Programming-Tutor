const STORAGE_KEY = "ctutorpro_state_v3";
const TOPICS = ["intro", "datatypes", "control", "loops", "arrays", "strings", "pointers"];
const BASE_STACK_ADDRESS = 0x7ffe1000;

const defaultState = {
  theme: "light",
  readTopics: {},
  interviewMode: false,
  solvedProblems: {},
  memoryEntries: []
};

let state = JSON.parse(JSON.stringify(defaultState));
let interviewSecondsLeft = 30 * 60;
let interviewTimerId = null;

function createExample(level, title, problem, code, explanation) {
  return { level, title, problem, code, explanation };
}

const EXAMPLES = {
  intro: [
    createExample(
      "Basic",
      "Hello World",
      "Write a C program that prints Hello, World! on the console.",
`#include <stdio.h>

int main(void) {
    printf("Hello, World!\\n");
    return 0;
}`,
      "This program includes stdio.h so printf can be used for output. The main function prints the line and exits with status code 0."
    ),
    createExample(
      "Basic",
      "Read and Print an Integer",
      "Write a C program that reads one integer from input and prints it back.",
`#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    printf("You entered: %d\\n", n);
    return 0;
}`,
      "The program stores input in an int variable using scanf. It then prints the same value to confirm successful input handling."
    ),
    createExample(
      "Basic",
      "Sum of Two Numbers",
      "Write a C program to read two integers and print their sum.",
`#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("Sum = %d\\n", a + b);
    return 0;
}`,
      "Two integers are captured from standard input in one scanf call. The addition is performed directly inside printf for concise output."
    ),
    createExample(
      "Basic",
      "Area of Circle",
      "Write a C program to calculate area of a circle from a given radius.",
`#include <stdio.h>

int main(void) {
    float radius;
    scanf("%f", &radius);
    printf("Area = %.2f\\n", 3.14159f * radius * radius);
    return 0;
}`,
      "The formula pi * r * r is implemented with a float constant for pi. Formatted output limits the result to two decimal places."
    ),
    createExample(
      "Basic",
      "Swap Two Variables",
      "Write a C program that swaps two integers using a temporary variable.",
`#include <stdio.h>

int main(void) {
    int a = 10, b = 20, temp;
    temp = a;
    a = b;
    b = temp;
    printf("a = %d, b = %d\\n", a, b);
    return 0;
}`,
      "A temporary variable holds one value during assignment so data is not lost. After three assignments, the original values are exchanged."
    ),
    createExample(
      "Intermediate",
      "Command Line Argument Count",
      "Write a C program that prints how many command-line arguments are passed.",
`#include <stdio.h>

int main(int argc, char *argv[]) {
    (void)argv;
    printf("Arguments count = %d\\n", argc);
    return 0;
}`,
      "The argc parameter stores how many tokens were passed in the command line. argv is unused here, so it is explicitly cast to void."
    ),
    createExample(
      "Intermediate",
      "Prime Check",
      "Write a C program that checks whether an input number is prime.",
`#include <stdio.h>

int main(void) {
    int n, i, prime = 1;
    scanf("%d", &n);

    if (n <= 1) prime = 0;
    for (i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            prime = 0;
            break;
        }
    }

    printf(prime ? "Prime\\n" : "Not Prime\\n");
    return 0;
}`,
      "The loop tests divisors only up to square root of n, which reduces redundant checks. A flag tracks whether any divisor was found and drives the final output."
    ),
    createExample(
      "Intermediate",
      "Factorial Using Recursion",
      "Write a C program to compute factorial of n using recursion.",
`#include <stdio.h>

long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main(void) {
    int n;
    scanf("%d", &n);
    printf("%lld\\n", factorial(n));
    return 0;
}`,
      "The recursive function reduces the problem size by one each call until the base case. The multiplication unwinds from the deepest call to compute n! correctly."
    ),
    createExample(
      "Intermediate",
      "Fibonacci Series",
      "Write a C program that prints first n terms of Fibonacci sequence.",
`#include <stdio.h>

int main(void) {
    int n, a = 0, b = 1, c;
    scanf("%d", &n);

    for (int i = 0; i < n; i++) {
        printf("%d ", a);
        c = a + b;
        a = b;
        b = c;
    }
    printf("\\n");
    return 0;
}`,
      "This iterative method keeps only the previous two numbers, so memory use stays constant. Each loop prints the current term and updates state for the next term."
    ),
    createExample(
      "Interview Level",
      "Menu Driven Calculator",
      "Write a C program with switch-case to perform +, -, *, / operations.",
`#include <stdio.h>

int main(void) {
    int choice;
    double a, b;

    scanf("%d", &choice);
    scanf("%lf %lf", &a, &b);

    switch (choice) {
        case 1: printf("%.2lf\\n", a + b); break;
        case 2: printf("%.2lf\\n", a - b); break;
        case 3: printf("%.2lf\\n", a * b); break;
        case 4:
            if (b == 0) printf("Division by zero\\n");
            else printf("%.2lf\\n", a / b);
            break;
        default: printf("Invalid choice\\n");
    }

    return 0;
}`,
      "Switch-case cleanly maps each operation to a branch based on user choice. Division handles the zero divisor edge case before performing arithmetic."
    )
  ],
  datatypes: [
    createExample(
      "Basic",
      "Print Sizes of Primitive Types",
      "Write a C program that prints size of int, char, float, and double.",
`#include <stdio.h>

int main(void) {
    printf("char   : %zu\\n", sizeof(char));
    printf("int    : %zu\\n", sizeof(int));
    printf("float  : %zu\\n", sizeof(float));
    printf("double : %zu\\n", sizeof(double));
    return 0;
}`,
      "The sizeof operator reports the platform-specific byte width of each type. This avoids hardcoding assumptions that may break across architectures."
    ),
    createExample(
      "Basic",
      "Type Casting in Division",
      "Write a C program that demonstrates integer division vs float division.",
`#include <stdio.h>

int main(void) {
    int a = 7, b = 2;
    printf("Integer division: %d\\n", a / b);
    printf("Float division  : %.2f\\n", (float)a / b);
    return 0;
}`,
      "Without casting, integer division discards the fractional part. Casting one operand to float promotes the operation and preserves decimals."
    ),
    createExample(
      "Basic",
      "ASCII Value of Character",
      "Write a C program to print character and its ASCII code.",
`#include <stdio.h>

int main(void) {
    char ch;
    scanf(" %c", &ch);
    printf("Character: %c, ASCII: %d\\n", ch, (int)ch);
    return 0;
}`,
      "Characters are stored internally as integer codes. Casting char to int reveals the corresponding ASCII numeric value."
    ),
    createExample(
      "Intermediate",
      "Unsigned Wrap-around",
      "Write a C program to show unsigned integer overflow behavior.",
`#include <stdio.h>
#include <limits.h>

int main(void) {
    unsigned int x = UINT_MAX;
    printf("Before: %u\\n", x);
    x = x + 1;
    printf("After : %u\\n", x);
    return 0;
}`,
      "Unsigned arithmetic in C wraps modulo 2^N for the bit width. Incrementing UINT_MAX therefore produces 0."
    ),
    createExample(
      "Intermediate",
      "Float vs Double Precision",
      "Write a C program to compare precision of float and double values.",
`#include <stdio.h>

int main(void) {
    float f = 1.0f / 3.0f;
    double d = 1.0 / 3.0;
    printf("float : %.9f\\n", f);
    printf("double: %.18lf\\n", d);
    return 0;
}`,
      "Float and double store the same mathematical value with different precision limits. Printing many decimals makes that precision gap visible."
    ),
    createExample(
      "Intermediate",
      "Long Long Multiplication",
      "Write a C program to multiply two large integers using long long.",
`#include <stdio.h>

int main(void) {
    long long a, b;
    scanf("%lld %lld", &a, &b);
    printf("Product = %lld\\n", a * b);
    return 0;
}`,
      "long long can hold much larger integer ranges than int on most systems. The correct format specifier %lld avoids undefined behavior while scanning and printing."
    ),
    createExample(
      "Intermediate",
      "Enum for Weekday",
      "Write a C program using enum to map numbers to weekdays.",
`#include <stdio.h>

enum Day { MON = 1, TUE, WED, THU, FRI, SAT, SUN };

int main(void) {
    enum Day d = WED;
    printf("Day value = %d\\n", d);
    return 0;
}`,
      "An enum assigns readable names to integral constants. This improves maintainability compared to scattering raw numeric values through code."
    ),
    createExample(
      "Interview Level",
      "Typedef Struct Student",
      "Write a C program using typedef struct to store and print student details.",
`#include <stdio.h>

typedef struct {
    int id;
    float marks;
} Student;

int main(void) {
    Student s = {101, 92.5f};
    printf("ID: %d, Marks: %.1f\\n", s.id, s.marks);
    return 0;
}`,
      "typedef removes the need to write struct keyword repeatedly. The struct groups related fields into one logical student record."
    ),
    createExample(
      "Interview Level",
      "Type Promotion Rules",
      "Write a C program that demonstrates implicit type promotion in expressions.",
`#include <stdio.h>

int main(void) {
    char c = 100;
    int x = c + 30;
    float y = x / 4;
    float z = x / 4.0f;

    printf("x = %d\\n", x);
    printf("y = %.2f\\n", y);
    printf("z = %.2f\\n", z);
    return 0;
}`,
      "char is promoted to int before arithmetic operations in expressions. Integer division happens before assignment to float unless one operand is floating-point."
    ),
    createExample(
      "Interview Level",
      "Detect Endianness",
      "Write a C program that checks whether machine endianness is little or big.",
`#include <stdio.h>

int main(void) {
    unsigned int x = 1;
    unsigned char *p = (unsigned char *)&x;

    if (*p == 1) {
        printf("Little Endian\\n");
    } else {
        printf("Big Endian\\n");
    }
    return 0;
}`,
      "The first byte of integer value 1 differs by endianness representation. Reading that byte through an unsigned char pointer identifies the machine layout."
    )
  ],
  control: [
    createExample(
      "Basic",
      "Pass or Fail",
      "Write a C program that prints Pass if marks >= 40, otherwise Fail.",
`#include <stdio.h>

int main(void) {
    int marks;
    scanf("%d", &marks);
    if (marks >= 40) printf("Pass\\n");
    else printf("Fail\\n");
    return 0;
}`,
      "A simple if-else branch selects one output path based on condition truth. This is the most common control-flow pattern in interview warmups."
    ),
    createExample(
      "Basic",
      "Leap Year Check",
      "Write a C program that checks whether a year is leap year.",
`#include <stdio.h>

int main(void) {
    int year;
    scanf("%d", &year);

    if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0))
        printf("Leap Year\\n");
    else
        printf("Not Leap Year\\n");

    return 0;
}`,
      "Leap year logic combines multiple divisibility rules with boolean operators. Parentheses make precedence explicit and keep the condition readable."
    ),
    createExample(
      "Basic",
      "Maximum of Three Numbers",
      "Write a C program to find maximum of three integers using nested if.",
`#include <stdio.h>

int main(void) {
    int a, b, c, max;
    scanf("%d %d %d", &a, &b, &c);

    if (a >= b) {
        if (a >= c) max = a;
        else max = c;
    } else {
        if (b >= c) max = b;
        else max = c;
    }

    printf("Max = %d\\n", max);
    return 0;
}`,
      "Nested if statements compare candidates step by step to locate the largest value. The final max variable captures the winning branch output."
    ),
    createExample(
      "Intermediate",
      "Vowel or Consonant",
      "Write a C program that checks whether a character is vowel using switch.",
`#include <stdio.h>

int main(void) {
    char ch;
    scanf(" %c", &ch);

    switch (ch) {
        case 'a': case 'e': case 'i': case 'o': case 'u':
        case 'A': case 'E': case 'I': case 'O': case 'U':
            printf("Vowel\\n");
            break;
        default:
            printf("Consonant or non-letter\\n");
    }

    return 0;
}`,
      "Switch handles multiple exact-match cases compactly without long if chains. Grouped cases fall through until one shared output is executed."
    ),
    createExample(
      "Intermediate",
      "Simple ATM Menu",
      "Write a menu-driven C program with switch for balance, deposit, and withdraw.",
`#include <stdio.h>

int main(void) {
    int choice;
    double balance = 1000.0, amount;

    scanf("%d", &choice);
    switch (choice) {
        case 1:
            printf("Balance: %.2f\\n", balance);
            break;
        case 2:
            scanf("%lf", &amount);
            balance += amount;
            printf("Balance: %.2f\\n", balance);
            break;
        case 3:
            scanf("%lf", &amount);
            if (amount <= balance) balance -= amount;
            printf("Balance: %.2f\\n", balance);
            break;
        default:
            printf("Invalid option\\n");
    }

    return 0;
}`,
      "The program routes execution based on user menu choice. Conditional logic inside the withdraw case prevents overdrawing beyond current balance."
    ),
    createExample(
      "Intermediate",
      "Triangle Validity",
      "Write a C program to check if three sides can form a valid triangle.",
`#include <stdio.h>

int main(void) {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);

    if (a + b > c && a + c > b && b + c > a)
        printf("Valid Triangle\\n");
    else
        printf("Invalid Triangle\\n");

    return 0;
}`,
      "A valid triangle requires each pairwise sum to exceed the remaining side. The compound condition enforces all three constraints together."
    ),
    createExample(
      "Intermediate",
      "Tax Slab Computation",
      "Write a C program that computes tax based on slab rates.",
`#include <stdio.h>

int main(void) {
    double income, tax;
    scanf("%lf", &income);

    if (income <= 250000) tax = 0;
    else if (income <= 500000) tax = (income - 250000) * 0.05;
    else if (income <= 1000000) tax = 12500 + (income - 500000) * 0.20;
    else tax = 112500 + (income - 1000000) * 0.30;

    printf("Tax = %.2f\\n", tax);
    return 0;
}`,
      "Else-if ladders are ideal for mutually exclusive range checks like tax slabs. Once one condition matches, lower branches are skipped automatically."
    ),
    createExample(
      "Interview Level",
      "Ternary Grade Output",
      "Write a C program that uses nested ternary operators to print grade.",
`#include <stdio.h>

int main(void) {
    int score;
    scanf("%d", &score);

    char grade = (score >= 90) ? 'A' :
                 (score >= 75) ? 'B' :
                 (score >= 60) ? 'C' :
                 'D';

    printf("Grade: %c\\n", grade);
    return 0;
}`,
      "Nested ternary expressions provide compact conditional assignment. Parenthesized chaining keeps precedence predictable and readable."
    ),
    createExample(
      "Interview Level",
      "Safe Division with Early Return",
      "Write a C function that divides two integers and avoids division-by-zero.",
`#include <stdio.h>

int safe_div(int a, int b) {
    if (b == 0) {
        return 0;
    }
    return a / b;
}

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("Result = %d\\n", safe_div(a, b));
    return 0;
}`,
      "The function exits early when denominator is zero, preventing undefined behavior. This guard pattern is common in defensive C programming."
    ),
    createExample(
      "Interview Level",
      "Switch Fall-through for Month Days",
      "Write a C program that prints 31-day months using switch fall-through groups.",
`#include <stdio.h>

int main(void) {
    int month;
    scanf("%d", &month);

    switch (month) {
        case 1: case 3: case 5: case 7: case 8: case 10: case 12:
            printf("31 days\\n");
            break;
        case 4: case 6: case 9: case 11:
            printf("30 days\\n");
            break;
        case 2:
            printf("28 or 29 days\\n");
            break;
        default:
            printf("Invalid month\\n");
    }

    return 0;
}`,
      "Grouped case labels intentionally fall through to share one output statement. This pattern reduces duplication for categories with identical behavior."
    )
  ],
  loops: [
    createExample(
      "Basic",
      "Sum of First N Natural Numbers",
      "Write a C program using loop to find sum of first n numbers.",
`#include <stdio.h>

int main(void) {
    int n;
    long long sum = 0;
    scanf("%d", &n);

    for (int i = 1; i <= n; i++) {
        sum += i;
    }

    printf("%lld\\n", sum);
    return 0;
}`,
      "The loop accumulates each integer from 1 through n in sum. long long is used to reduce overflow risk for larger inputs."
    ),
    createExample(
      "Basic",
      "Multiplication Table",
      "Write a C program to print multiplication table of a number up to 10.",
`#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    for (int i = 1; i <= 10; i++) {
        printf("%d x %d = %d\\n", n, i, n * i);
    }

    return 0;
}`,
      "A counted for loop iterates exactly ten times for fixed table output. Each iteration prints one formatted multiplication row."
    ),
    createExample(
      "Basic",
      "Count Digits in Number",
      "Write a C program that counts digits of an integer using while loop.",
`#include <stdio.h>

int main(void) {
    int n, count = 0;
    scanf("%d", &n);

    if (n == 0) count = 1;
    while (n != 0) {
        count++;
        n /= 10;
    }

    printf("Digits = %d\\n", count);
    return 0;
}`,
      "Each division by 10 removes the last decimal digit until no digits remain. A special case handles input 0, which has one digit."
    ),
    createExample(
      "Intermediate",
      "Reverse a Number",
      "Write a C program to reverse digits of a positive integer.",
`#include <stdio.h>

int main(void) {
    int n, rev = 0;
    scanf("%d", &n);

    while (n > 0) {
        rev = rev * 10 + (n % 10);
        n /= 10;
    }

    printf("%d\\n", rev);
    return 0;
}`,
      "The last digit is extracted using modulo and appended to rev each step. Dividing n by 10 moves processing to the next digit."
    ),
    createExample(
      "Intermediate",
      "Palindrome Number",
      "Write a C program that checks whether an integer is palindrome.",
`#include <stdio.h>

int main(void) {
    int n, temp, rev = 0;
    scanf("%d", &n);
    temp = n;

    while (temp > 0) {
        rev = rev * 10 + temp % 10;
        temp /= 10;
    }

    printf((rev == n) ? "Palindrome\\n" : "Not Palindrome\\n");
    return 0;
}`,
      "The number is reversed digit by digit in a loop without extra arrays. Comparing reversed value with original determines palindrome status."
    ),
    createExample(
      "Intermediate",
      "GCD Using Euclid Loop",
      "Write a C program to compute gcd of two numbers iteratively.",
`#include <stdio.h>

int main(void) {
    int a, b, t;
    scanf("%d %d", &a, &b);

    while (b != 0) {
        t = a % b;
        a = b;
        b = t;
    }

    printf("GCD = %d\\n", a);
    return 0;
}`,
      "Euclid's algorithm repeatedly replaces the pair with divisor and remainder. The last non-zero divisor is the greatest common divisor."
    ),
    createExample(
      "Intermediate",
      "Star Triangle Pattern",
      "Write a C program that prints a right-angle star triangle of height n.",
`#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            printf("*");
        }
        printf("\\n");
    }

    return 0;
}`,
      "Nested loops are used where outer loop controls rows and inner loop controls columns. The number of stars grows with row index."
    ),
    createExample(
      "Interview Level",
      "Prime Numbers in Range",
      "Write a C program to print all prime numbers between two inputs.",
`#include <stdio.h>

int main(void) {
    int l, r;
    scanf("%d %d", &l, &r);

    for (int n = l; n <= r; n++) {
        if (n < 2) continue;
        int prime = 1;
        for (int d = 2; d * d <= n; d++) {
            if (n % d == 0) {
                prime = 0;
                break;
            }
        }
        if (prime) printf("%d ", n);
    }
    printf("\\n");
    return 0;
}`,
      "The outer loop visits every candidate in range while inner loop checks divisibility. Limiting divisor checks to sqrt(n) keeps it efficient for interview constraints."
    ),
    createExample(
      "Interview Level",
      "Armstrong Number Check",
      "Write a C program to test whether a 3-digit number is an Armstrong number.",
`#include <stdio.h>

int main(void) {
    int n, temp, digit, sum = 0;
    scanf("%d", &n);
    temp = n;

    while (temp > 0) {
        digit = temp % 10;
        sum += digit * digit * digit;
        temp /= 10;
    }

    printf((sum == n) ? "Armstrong\\n" : "Not Armstrong\\n");
    return 0;
}`,
      "The loop isolates each digit and adds its cube into running sum. For 3-digit Armstrong numbers, this sum equals the original number."
    ),
    createExample(
      "Interview Level",
      "Trace of Matrix",
      "Write a C program using nested loops to compute trace of n x n matrix.",
`#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int a[20][20];
    int trace = 0;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            scanf("%d", &a[i][j]);
            if (i == j) trace += a[i][j];
        }
    }

    printf("Trace = %d\\n", trace);
    return 0;
}`,
      "Input traversal and diagonal sum are combined in one nested loop pass. Adding only when i equals j collects principal diagonal elements."
    )
  ],
  arrays: [
    createExample(
      "Basic",
      "Find Maximum Element",
      "Write a C program to find maximum value in an array.",
`#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int arr[100];

    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);

    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
    }

    printf("Max = %d\\n", max);
    return 0;
}`,
      "The first element initializes max as a baseline comparison value. One pass through the array updates max whenever a larger value appears."
    ),
    createExample(
      "Basic",
      "Reverse Array In-place",
      "Write a C program that reverses an array without extra array.",
`#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int arr[100];

    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);

    for (int i = 0, j = n - 1; i < j; i++, j--) {
        int t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
    }

    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
      "Two-pointer swapping mirrors elements from both ends toward the center. This approach runs in O(n) time and O(1) extra space."
    ),
    createExample(
      "Basic",
      "Linear Search",
      "Write a C program to find index of key using linear search.",
`#include <stdio.h>

int main(void) {
    int n, key, pos = -1;
    scanf("%d", &n);
    int arr[100];

    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    scanf("%d", &key);

    for (int i = 0; i < n; i++) {
        if (arr[i] == key) {
            pos = i;
            break;
        }
    }

    printf("%d\\n", pos);
    return 0;
}`,
      "The program checks each array element sequentially against the target key. It exits early when match is found, otherwise returns -1."
    ),
    createExample(
      "Intermediate",
      "Binary Search",
      "Write a C program to search key in sorted array using binary search.",
`#include <stdio.h>

int main(void) {
    int n, key;
    scanf("%d", &n);
    int arr[100];

    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    scanf("%d", &key);

    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == key) {
            ans = mid;
            break;
        } else if (arr[mid] < key) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }

    printf("%d\\n", ans);
    return 0;
}`,
      "Binary search repeatedly halves the search interval in a sorted array. This reduces time complexity from O(n) to O(log n)."
    ),
    createExample(
      "Intermediate",
      "Second Largest Element",
      "Write a C program to find second largest element in an array.",
`#include <stdio.h>
#include <limits.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int arr[100];
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);

    int first = INT_MIN, second = INT_MIN;
    for (int i = 0; i < n; i++) {
        if (arr[i] > first) {
            second = first;
            first = arr[i];
        } else if (arr[i] > second && arr[i] != first) {
            second = arr[i];
        }
    }

    printf("Second Largest = %d\\n", second);
    return 0;
}`,
      "Two tracking variables keep top two distinct values in one traversal. Update order is important to avoid losing the previous maximum."
    ),
    createExample(
      "Intermediate",
      "Rotate Array Right by One",
      "Write a C program to rotate an array to the right by one position.",
`#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int arr[100];
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);

    int last = arr[n - 1];
    for (int i = n - 1; i > 0; i--) {
        arr[i] = arr[i - 1];
    }
    arr[0] = last;

    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
      "The last element is buffered before shifting others to the right. After shifting, buffered value is placed at index 0 to complete rotation."
    ),
    createExample(
      "Interview Level",
      "Matrix Addition",
      "Write a C program to add two matrices of same size.",
`#include <stdio.h>

int main(void) {
    int r, c;
    scanf("%d %d", &r, &c);
    int a[20][20], b[20][20], sum[20][20];

    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++) scanf("%d", &a[i][j]);

    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++) scanf("%d", &b[i][j]);

    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            sum[i][j] = a[i][j] + b[i][j];
            printf("%d ", sum[i][j]);
        }
        printf("\\n");
    }

    return 0;
}`,
      "Corresponding cells are added with matching row and column indices. Nested loops traverse two-dimensional arrays systematically."
    ),
    createExample(
      "Interview Level",
      "Matrix Multiplication",
      "Write a C program to multiply two matrices A(r x c) and B(c x k).",
`#include <stdio.h>

int main(void) {
    int r, c, k;
    scanf("%d %d %d", &r, &c, &k);

    int a[20][20], b[20][20], p[20][20] = {0};

    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++) scanf("%d", &a[i][j]);

    for (int i = 0; i < c; i++)
        for (int j = 0; j < k; j++) scanf("%d", &b[i][j]);

    for (int i = 0; i < r; i++) {
        for (int j = 0; j < k; j++) {
            for (int x = 0; x < c; x++) {
                p[i][j] += a[i][x] * b[x][j];
            }
            printf("%d ", p[i][j]);
        }
        printf("\\n");
    }

    return 0;
}`,
      "The inner loop computes dot product of a row from A and column from B. Compatibility requires A columns to equal B rows."
    ),
    createExample(
      "Interview Level",
      "Transpose of Matrix",
      "Write a C program to transpose a matrix.",
`#include <stdio.h>

int main(void) {
    int r, c;
    scanf("%d %d", &r, &c);
    int a[20][20];

    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++) scanf("%d", &a[i][j]);

    for (int i = 0; i < c; i++) {
        for (int j = 0; j < r; j++) {
            printf("%d ", a[j][i]);
        }
        printf("\\n");
    }

    return 0;
}`,
      "Transpose swaps row and column indices while reading original matrix. Printing a[j][i] instead of a[i][j] creates the transposed layout."
    ),
    createExample(
      "Interview Level",
      "Maximum Subarray Sum (Kadane)",
      "Write a C program to find maximum subarray sum in O(n) time.",
`#include <stdio.h>
#include <limits.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int arr[1000];

    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);

    int best = INT_MIN, cur = 0;
    for (int i = 0; i < n; i++) {
        if (cur < 0) cur = 0;
        cur += arr[i];
        if (cur > best) best = cur;
    }

    printf("%d\\n", best);
    return 0;
}`,
      "Kadane's algorithm discards negative running sums because they hurt future totals. One linear pass tracks the best sum seen so far."
    )
  ],
  strings: [
    createExample(
      "Basic",
      "String Length Without strlen",
      "Write a C program to compute string length manually.",
`#include <stdio.h>

int main(void) {
    char s[200];
    int len = 0;
    fgets(s, sizeof(s), stdin);

    while (s[len] != '\\0' && s[len] != '\\n') len++;

    printf("Length = %d\\n", len);
    return 0;
}`,
      "The program iterates until null terminator or newline appears in buffer. This mirrors how strlen counts characters internally."
    ),
    createExample(
      "Basic",
      "Copy String Manually",
      "Write a C program to copy one string into another without strcpy.",
`#include <stdio.h>

int main(void) {
    char src[100], dst[100];
    int i = 0;

    fgets(src, sizeof(src), stdin);
    while (src[i] != '\\0') {
        dst[i] = src[i];
        i++;
    }
    dst[i] = '\\0';

    printf("%s", dst);
    return 0;
}`,
      "Characters are copied one by one from source to destination buffer. The explicit null terminator ensures destination remains a valid C string."
    ),
    createExample(
      "Basic",
      "Reverse String",
      "Write a C program that reverses a string in-place.",
`#include <stdio.h>
#include <string.h>

int main(void) {
    char s[100];
    fgets(s, sizeof(s), stdin);
    s[strcspn(s, "\\n")] = '\\0';

    int i = 0, j = (int)strlen(s) - 1;
    while (i < j) {
        char t = s[i];
        s[i] = s[j];
        s[j] = t;
        i++;
        j--;
    }

    printf("%s\\n", s);
    return 0;
}`,
      "Two pointers swap characters from both ends toward the center. Newline is removed before reversal to avoid output artifacts."
    ),
    createExample(
      "Intermediate",
      "Palindrome String",
      "Write a C program to check whether a string is palindrome.",
`#include <stdio.h>
#include <string.h>

int main(void) {
    char s[100];
    fgets(s, sizeof(s), stdin);
    s[strcspn(s, "\\n")] = '\\0';

    int l = 0, r = (int)strlen(s) - 1, ok = 1;
    while (l < r) {
        if (s[l] != s[r]) {
            ok = 0;
            break;
        }
        l++;
        r--;
    }

    printf(ok ? "Palindrome\\n" : "Not Palindrome\\n");
    return 0;
}`,
      "Symmetric characters are compared from both ends of the string. Any mismatch immediately proves it is not a palindrome."
    ),
    createExample(
      "Intermediate",
      "Count Vowels, Consonants, Spaces",
      "Write a C program to count vowels, consonants, and spaces in a sentence.",
`#include <stdio.h>
#include <ctype.h>

int main(void) {
    char s[200];
    int v = 0, c = 0, sp = 0;
    fgets(s, sizeof(s), stdin);

    for (int i = 0; s[i] != '\\0'; i++) {
        char ch = (char)tolower((unsigned char)s[i]);
        if (ch == ' ') sp++;
        else if (ch >= 'a' && ch <= 'z') {
            if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') v++;
            else c++;
        }
    }

    printf("Vowels=%d Consonants=%d Spaces=%d\\n", v, c, sp);
    return 0;
}`,
      "Each character is normalized to lowercase to simplify checks. Alphabetic characters are then split into vowel and consonant groups."
    ),
    createExample(
      "Intermediate",
      "CSV Parsing",
      "Write a C program that parses a comma-separated string into tokens.",
`#include <stdio.h>
#include <string.h>

int main(void) {
    char s[200];
    fgets(s, sizeof(s), stdin);
    s[strcspn(s, "\\n")] = '\\0';

    char *token = strtok(s, ",");
    while (token != NULL) {
        printf("[%s]\\n", token);
        token = strtok(NULL, ",");
    }

    return 0;
}`,
      "strtok splits the original buffer at delimiter boundaries and returns tokens sequentially. This is a common entry-level approach for simple CSV-like parsing."
    ),
    createExample(
      "Interview Level",
      "Remove Extra Spaces",
      "Write a C program that trims repeated spaces between words to a single space.",
`#include <stdio.h>

int main(void) {
    char s[300], out[300];
    int i = 0, j = 0, prevSpace = 0;
    fgets(s, sizeof(s), stdin);

    while (s[i] != '\\0') {
        if (s[i] == ' ') {
            if (!prevSpace) out[j++] = ' ';
            prevSpace = 1;
        } else if (s[i] != '\\n') {
            out[j++] = s[i];
            prevSpace = 0;
        }
        i++;
    }

    out[j] = '\\0';
    printf("%s\\n", out);
    return 0;
}`,
      "A write index constructs cleaned output while reading original input once. The prevSpace flag prevents writing consecutive space characters."
    ),
    createExample(
      "Interview Level",
      "Character Frequency",
      "Write a C program that counts frequency of lowercase letters in a string.",
`#include <stdio.h>
#include <ctype.h>

int main(void) {
    char s[300];
    int freq[26] = {0};
    fgets(s, sizeof(s), stdin);

    for (int i = 0; s[i] != '\\0'; i++) {
        char ch = (char)tolower((unsigned char)s[i]);
        if (ch >= 'a' && ch <= 'z') freq[ch - 'a']++;
    }

    for (int i = 0; i < 26; i++) {
        if (freq[i] > 0) printf("%c -> %d\\n", 'a' + i, freq[i]);
    }
    return 0;
}`,
      "An integer array indexed by alphabet offset stores occurrence counts. This achieves O(n) counting time with constant auxiliary space."
    ),
    createExample(
      "Interview Level",
      "Implement strstr",
      "Write a C function that returns first index of pattern in text without library search.",
`#include <stdio.h>
#include <string.h>

int find_sub(const char *text, const char *pat) {
    int n = (int)strlen(text), m = (int)strlen(pat);
    for (int i = 0; i + m <= n; i++) {
        int j = 0;
        while (j < m && text[i + j] == pat[j]) j++;
        if (j == m) return i;
    }
    return -1;
}

int main(void) {
    char text[200], pat[100];
    fgets(text, sizeof(text), stdin);
    fgets(pat, sizeof(pat), stdin);
    text[strcspn(text, "\\n")] = '\\0';
    pat[strcspn(pat, "\\n")] = '\\0';
    printf("%d\\n", find_sub(text, pat));
    return 0;
}`,
      "The function checks each possible start position and compares pattern sequentially. Returning the first full match index replicates strstr-like behavior."
    ),
    createExample(
      "Interview Level",
      "Implement atoi",
      "Write a C program to convert string to integer handling leading spaces and sign.",
`#include <stdio.h>
#include <ctype.h>

int my_atoi(const char *s) {
    int i = 0, sign = 1, value = 0;
    while (isspace((unsigned char)s[i])) i++;
    if (s[i] == '+' || s[i] == '-') {
        if (s[i] == '-') sign = -1;
        i++;
    }
    while (isdigit((unsigned char)s[i])) {
        value = value * 10 + (s[i] - '0');
        i++;
    }
    return sign * value;
}

int main(void) {
    char s[100];
    fgets(s, sizeof(s), stdin);
    printf("%d\\n", my_atoi(s));
    return 0;
}`,
      "The parser skips whitespace, reads optional sign, then accumulates numeric digits. This mirrors the core behavior of standard atoi for valid input prefixes."
    )
  ],
  pointers: [
    createExample(
      "Basic",
      "Pointer Dereference",
      "Write a C program that prints value and address of an integer using pointer.",
`#include <stdio.h>

int main(void) {
    int x = 25;
    int *p = &x;
    printf("Value = %d\\n", *p);
    printf("Address = %p\\n", (void *)p);
    return 0;
}`,
      "The pointer stores memory address of x using address-of operator. Dereferencing that pointer retrieves the original value stored at that location."
    ),
    createExample(
      "Basic",
      "Swap Using Pointers",
      "Write a C function swap(int *a, int *b) and use it in main.",
`#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int main(void) {
    int x = 4, y = 9;
    swap(&x, &y);
    printf("x=%d y=%d\\n", x, y);
    return 0;
}`,
      "Addresses are passed so the function edits original caller variables. Swapping dereferenced values updates both integers in place."
    ),
    createExample(
      "Basic",
      "Sum Array with Pointer Arithmetic",
      "Write a C program to sum array elements using only pointers.",
`#include <stdio.h>

int main(void) {
    int arr[] = {2, 4, 6, 8, 10};
    int n = (int)(sizeof(arr) / sizeof(arr[0]));
    int *p = arr;
    int sum = 0;

    for (int i = 0; i < n; i++) {
        sum += *(p + i);
    }

    printf("Sum = %d\\n", sum);
    return 0;
}`,
      "Pointer arithmetic accesses elements relative to base address. This demonstrates array indexing and pointer offsets are equivalent in C."
    ),
    createExample(
      "Intermediate",
      "Double Pointer Demo",
      "Write a C program that uses int ** to modify an int value.",
`#include <stdio.h>

int main(void) {
    int x = 5;
    int *p = &x;
    int **pp = &p;

    **pp = 20;
    printf("x = %d\\n", x);
    return 0;
}`,
      "A double pointer stores the address of another pointer. Dereferencing twice reaches the original integer and allows modification."
    ),
    createExample(
      "Intermediate",
      "Dynamic Memory Allocation",
      "Write a C program that allocates n integers with malloc, fills and prints them.",
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int *arr = (int *)malloc((size_t)n * sizeof(int));
    if (arr == NULL) {
        printf("Allocation failed\\n");
        return 0;
    }

    for (int i = 0; i < n; i++) {
        arr[i] = i + 1;
        printf("%d ", arr[i]);
    }
    printf("\\n");

    free(arr);
    return 0;
}`,
      "malloc returns heap memory whose lifetime is controlled manually. free is required to avoid memory leaks after data usage completes."
    ),
    createExample(
      "Intermediate",
      "Function Pointer",
      "Write a C program using a function pointer to call add().",
`#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main(void) {
    int (*op)(int, int) = add;
    printf("%d\\n", op(7, 3));
    return 0;
}`,
      "Function pointers store executable addresses of compatible functions. They enable callback-style behavior and dynamic dispatch patterns in C."
    ),
    createExample(
      "Interview Level",
      "Return Pointer to Static Array",
      "Write a C function that returns pointer to static int array.",
`#include <stdio.h>

int *get_values(void) {
    static int arr[3] = {10, 20, 30};
    return arr;
}

int main(void) {
    int *p = get_values();
    for (int i = 0; i < 3; i++) printf("%d ", p[i]);
    printf("\\n");
    return 0;
}`,
      "Static storage keeps the array alive after function returns. Returning its pointer is safe because memory is not stack-allocated."
    ),
    createExample(
      "Interview Level",
      "Reverse Linked List Iteratively",
      "Write a C program to reverse a singly linked list using pointers.",
`#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int val;
    struct Node *next;
} Node;

Node *reverse(Node *head) {
    Node *prev = NULL, *cur = head;
    while (cur != NULL) {
        Node *nextNode = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nextNode;
    }
    return prev;
}

int main(void) {
    Node *a = (Node *)malloc(sizeof(Node));
    Node *b = (Node *)malloc(sizeof(Node));
    Node *c = (Node *)malloc(sizeof(Node));
    a->val = 1; b->val = 2; c->val = 3;
    a->next = b; b->next = c; c->next = NULL;

    Node *head = reverse(a);
    while (head) {
        printf("%d ", head->val);
        Node *tmp = head;
        head = head->next;
        free(tmp);
    }
    printf("\\n");
    return 0;
}`,
      "Three pointers track previous, current, and next nodes during in-place reversal. Each iteration flips one link direction until list end is reached."
    ),
    createExample(
      "Interview Level",
      "Detect Cycle (Floyd)",
      "Write a C function that detects cycle in linked list using slow/fast pointers.",
`#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int val;
    struct Node *next;
} Node;

int has_cycle(Node *head) {
    Node *slow = head;
    Node *fast = head;

    while (fast != NULL && fast->next != NULL) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return 1;
    }
    return 0;
}

int main(void) {
    Node *a = (Node *)malloc(sizeof(Node));
    Node *b = (Node *)malloc(sizeof(Node));
    Node *c = (Node *)malloc(sizeof(Node));
    a->next = b; b->next = c; c->next = b;
    printf("%d\\n", has_cycle(a));
    free(a); free(b); free(c);
    return 0;
}`,
      "The fast pointer moves two steps while slow pointer moves one step. If a cycle exists, both pointers eventually meet at the same node."
    ),
    createExample(
      "Interview Level",
      "2D Dynamic Matrix with Double Pointers",
      "Write a C program that allocates and prints a dynamic r x c matrix.",
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int r = 2, c = 3;
    int **mat = (int **)malloc((size_t)r * sizeof(int *));

    for (int i = 0; i < r; i++) {
        mat[i] = (int *)malloc((size_t)c * sizeof(int));
    }

    int val = 1;
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            mat[i][j] = val++;
            printf("%d ", mat[i][j]);
        }
        printf("\\n");
    }

    for (int i = 0; i < r; i++) free(mat[i]);
    free(mat);
    return 0;
}`,
      "First allocation creates row pointers and each second allocation creates row storage. Matching free calls in reverse order avoids memory leaks."
    )
  ]
};

const PROBLEMS = [
  {
    id: 1,
    title: "Reverse Linked List",
    topic: "Linked List",
    difficulty: "Interview Level",
    statement: "Given the head of a singly linked list, reverse the list and return the new head. Solve it iteratively in O(n) time and O(1) extra space.",
    hint: "Maintain three pointers: prev, cur, and next. Flip one next pointer per iteration."
  },
  {
    id: 2,
    title: "Merge Two Sorted Lists",
    topic: "Linked List",
    difficulty: "Intermediate",
    statement: "Given two sorted linked lists, merge them into one sorted linked list and return its head. Reuse existing nodes without extra arrays.",
    hint: "Use a dummy node and always attach the smaller current node from both lists."
  },
  {
    id: 3,
    title: "Linked List Cycle Detection",
    topic: "Linked List",
    difficulty: "Interview Level",
    statement: "Determine whether a singly linked list has a cycle. Return true if fast and slow pointers meet, else false.",
    hint: "Advance slow by one and fast by two until fast reaches null or both pointers meet."
  },
  {
    id: 4,
    title: "Remove Nth Node From End",
    topic: "Linked List",
    difficulty: "Interview Level",
    statement: "Remove the nth node from the end of a linked list in one pass and return the updated head.",
    hint: "Use two pointers with an n-node gap, then move both until front reaches the end."
  },
  {
    id: 5,
    title: "Middle of Linked List",
    topic: "Linked List",
    difficulty: "Basic",
    statement: "Return the middle node of a singly linked list. If there are two middle nodes, return the second middle.",
    hint: "Fast pointer moves 2x speed while slow moves 1x speed."
  },
  {
    id: 6,
    title: "Matrix Multiplication",
    topic: "Matrix",
    difficulty: "Intermediate",
    statement: "Given matrix A (r x c) and B (c x k), compute product matrix P (r x k).",
    hint: "Use three nested loops; inner loop computes dot product for each output cell."
  },
  {
    id: 7,
    title: "Spiral Matrix Traversal",
    topic: "Matrix",
    difficulty: "Interview Level",
    statement: "Print all elements of a matrix in spiral order from outer boundary inward.",
    hint: "Track top, bottom, left, right boundaries and shrink after each side traversal."
  },
  {
    id: 8,
    title: "Rotate Matrix 90 Degrees",
    topic: "Matrix",
    difficulty: "Interview Level",
    statement: "Rotate an n x n matrix by 90 degrees clockwise in place.",
    hint: "Transpose matrix first, then reverse each row."
  },
  {
    id: 9,
    title: "Search in Sorted Matrix",
    topic: "Matrix",
    difficulty: "Intermediate",
    statement: "Given matrix where rows and columns are sorted ascending, find target efficiently.",
    hint: "Start at top-right corner and move left or down based on comparison."
  },
  {
    id: 10,
    title: "Set Matrix Zeroes",
    topic: "Matrix",
    difficulty: "Interview Level",
    statement: "If an element in matrix is 0, set its entire row and column to 0 in-place.",
    hint: "Use first row and first column as marker arrays to keep space O(1)."
  },
  {
    id: 11,
    title: "Valid Palindrome",
    topic: "Strings",
    difficulty: "Basic",
    statement: "Check whether a string is palindrome considering only alphanumeric characters and ignoring case.",
    hint: "Use two pointers from both ends and skip non-alphanumeric characters."
  },
  {
    id: 12,
    title: "String to Integer (atoi)",
    topic: "Strings",
    difficulty: "Interview Level",
    statement: "Implement atoi handling leading spaces, optional sign, digits, and overflow clamping.",
    hint: "Parse in phases: whitespace, sign, digits, overflow check before multiplying by 10."
  },
  {
    id: 13,
    title: "Longest Substring Without Repeating Characters",
    topic: "Strings",
    difficulty: "Interview Level",
    statement: "Return the length of longest substring with all unique characters.",
    hint: "Sliding window with last seen index array gives O(n) complexity."
  },
  {
    id: 14,
    title: "Group Anagrams",
    topic: "Strings",
    difficulty: "Interview Level",
    statement: "Group words that are anagrams of each other from an input list of strings.",
    hint: "Sort each word (or count letters) to build canonical hashmap key."
  },
  {
    id: 15,
    title: "Minimum Window Substring",
    topic: "Strings",
    difficulty: "Interview Level",
    statement: "Find the smallest substring of s containing all characters of t.",
    hint: "Use sliding window with required frequency map and formed counter."
  },
  {
    id: 16,
    title: "Implement strstr",
    topic: "Strings",
    difficulty: "Intermediate",
    statement: "Return first index where needle appears in haystack, or -1 if absent.",
    hint: "Try every possible start index and compare character by character."
  },
  {
    id: 17,
    title: "CSV String Parsing",
    topic: "String Parsing",
    difficulty: "Intermediate",
    statement: "Parse a CSV line into fields while handling empty tokens between commas.",
    hint: "Scan char by char and split on commas instead of relying only on strtok."
  },
  {
    id: 18,
    title: "Evaluate Reverse Polish Notation",
    topic: "Stack",
    difficulty: "Intermediate",
    statement: "Evaluate arithmetic expression given in Reverse Polish Notation.",
    hint: "Push operands and pop top two values when operator appears."
  },
  {
    id: 19,
    title: "Balanced Brackets",
    topic: "Stack",
    difficulty: "Basic",
    statement: "Check whether expression has balanced parentheses, braces, and brackets.",
    hint: "Use stack of opening brackets and match each closing bracket."
  },
  {
    id: 20,
    title: "Simplify Unix Path",
    topic: "Stack",
    difficulty: "Intermediate",
    statement: "Simplify an absolute Unix-style path to canonical form.",
    hint: "Split by '/', ignore '.' and use stack to process '..'."
  },
  {
    id: 21,
    title: "Two Sum",
    topic: "Arrays",
    difficulty: "Basic",
    statement: "Find indices of two numbers that add up to target.",
    hint: "Use hash map from value to index as you iterate once."
  },
  {
    id: 22,
    title: "Best Time to Buy and Sell Stock",
    topic: "Arrays",
    difficulty: "Basic",
    statement: "Given stock prices, maximize profit with one buy and one sell.",
    hint: "Track minimum price so far and best profit at each day."
  },
  {
    id: 23,
    title: "Product of Array Except Self",
    topic: "Arrays",
    difficulty: "Interview Level",
    statement: "Return array output where output[i] is product of all nums except nums[i] without division.",
    hint: "Build prefix products left-to-right and suffix products right-to-left."
  },
  {
    id: 24,
    title: "Maximum Subarray",
    topic: "Arrays",
    difficulty: "Intermediate",
    statement: "Find contiguous subarray with largest sum.",
    hint: "Kadane's algorithm keeps best ending-here sum in linear time."
  },
  {
    id: 25,
    title: "Move Zeroes",
    topic: "Arrays",
    difficulty: "Basic",
    statement: "Move all zeros to end while preserving relative order of non-zero elements.",
    hint: "Use write index for non-zero elements, fill rest with zeros."
  },
  {
    id: 26,
    title: "Single Number",
    topic: "Bitwise Manipulation",
    difficulty: "Basic",
    statement: "Every element appears twice except one. Find that single element.",
    hint: "XOR of equal numbers cancels to zero, so total XOR gives answer."
  },
  {
    id: 27,
    title: "Count Set Bits",
    topic: "Bitwise Manipulation",
    difficulty: "Intermediate",
    statement: "Count number of 1 bits in unsigned integer.",
    hint: "Apply n &= (n-1) repeatedly to remove rightmost set bit."
  },
  {
    id: 28,
    title: "Reverse Bits",
    topic: "Bitwise Manipulation",
    difficulty: "Interview Level",
    statement: "Reverse bits of a 32-bit unsigned integer.",
    hint: "Build result by shifting left and appending n & 1 each iteration."
  },
  {
    id: 29,
    title: "Power of Two",
    topic: "Bitwise Manipulation",
    difficulty: "Basic",
    statement: "Return true if integer n is a power of two.",
    hint: "Positive n with exactly one set bit satisfies n & (n - 1) == 0."
  },
  {
    id: 30,
    title: "Sum Without Plus",
    topic: "Bitwise Manipulation",
    difficulty: "Interview Level",
    statement: "Compute sum of two integers using bit operators only.",
    hint: "Use XOR for partial sum and AND-shift for carry until carry is zero."
  },
  {
    id: 31,
    title: "Climbing Stairs",
    topic: "Dynamic Programming",
    difficulty: "Basic",
    statement: "Count ways to climb n stairs taking 1 or 2 steps at a time.",
    hint: "Recurrence is fibonacci-like: dp[i] = dp[i-1] + dp[i-2]."
  },
  {
    id: 32,
    title: "Coin Change",
    topic: "Dynamic Programming",
    difficulty: "Interview Level",
    statement: "Find minimum number of coins needed to form target amount.",
    hint: "Bottom-up dp with initialization to large value and transitions over coins."
  },
  {
    id: 33,
    title: "Longest Increasing Subsequence",
    topic: "Dynamic Programming",
    difficulty: "Interview Level",
    statement: "Given integer array, return length of longest strictly increasing subsequence.",
    hint: "Use patience sorting idea with binary search over tails array."
  },
  {
    id: 34,
    title: "Subset Sum",
    topic: "Dynamic Programming",
    difficulty: "Intermediate",
    statement: "Determine if there exists a subset summing exactly to target value.",
    hint: "Boolean dp over sums where dp[s] means achievable sum s."
  },
  {
    id: 35,
    title: "Shortest Path in Grid",
    topic: "Graph",
    difficulty: "Interview Level",
    statement: "Given grid with obstacles, find shortest path from source to destination.",
    hint: "Use BFS with queue because each move has equal cost."
  },
  {
    id: 36,
    title: "Number of Islands",
    topic: "Graph",
    difficulty: "Intermediate",
    statement: "Count connected components of land cells in binary grid.",
    hint: "Run DFS or BFS from each unvisited land cell and mark component."
  },
  {
    id: 37,
    title: "Binary Tree Inorder Traversal",
    topic: "Trees",
    difficulty: "Basic",
    statement: "Return inorder traversal of binary tree nodes.",
    hint: "Inorder visits left subtree, node, then right subtree."
  },
  {
    id: 38,
    title: "Lowest Common Ancestor in BST",
    topic: "Trees",
    difficulty: "Intermediate",
    statement: "Find LCA of two nodes in a binary search tree.",
    hint: "Use BST property: move left if both targets smaller, right if both larger."
  },
  {
    id: 39,
    title: "Kth Largest Element",
    topic: "Heap",
    difficulty: "Intermediate",
    statement: "Find kth largest element in an unsorted array.",
    hint: "Maintain min-heap of size k while iterating array."
  },
  {
    id: 40,
    title: "LRU Cache Design",
    topic: "Design",
    difficulty: "Interview Level",
    statement: "Implement LRU cache supporting get and put in O(1) average time.",
    hint: "Combine hashmap with doubly linked list to track recency order."
  }
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    state = {
      ...defaultState,
      ...parsed,
      readTopics: { ...defaultState.readTopics, ...(parsed.readTopics || {}) },
      solvedProblems: { ...defaultState.solvedProblems, ...(parsed.solvedProblems || {}) },
      memoryEntries: Array.isArray(parsed.memoryEntries) ? parsed.memoryEntries : []
    };
  } catch (error) {
    state = JSON.parse(JSON.stringify(defaultState));
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  state.theme = theme;
  saveState();
}

function toggleTheme() {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  setTheme(isDark ? "light" : "dark");
}

function showSection(id) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("visible");
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  const targetSection = document.getElementById(id);
  const targetNav = document.querySelector(`.nav-item[data-target="${id}"]`);

  if (targetSection) targetSection.classList.add("visible");
  if (targetNav) targetNav.classList.add("active");

  if (window.innerWidth <= 920) {
    document.getElementById("sidebar").classList.remove("open");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress() {
  const completed = TOPICS.filter((topic) => !!state.readTopics[topic]).length;
  const percent = Math.round((completed / TOPICS.length) * 100);
  const fill = document.getElementById("progress-fill");
  const label = document.getElementById("progress-label");
  const track = document.querySelector(".progress-track");

  fill.style.width = `${percent}%`;
  label.textContent = `${percent}% COMPLETE`;
  track.setAttribute("aria-valuenow", String(percent));
}

function updateNavCompletionFlags() {
  TOPICS.forEach((topic) => {
    const nav = document.querySelector(`.nav-item[data-target="${topic}"]`);
    if (!nav) return;
    nav.classList.toggle("done", !!state.readTopics[topic]);
  });
}

function restoreTopicCheckboxes() {
  TOPICS.forEach((topic) => {
    const cb = document.querySelector(`input[data-topic="${topic}"]`);
    if (cb) cb.checked = !!state.readTopics[topic];
  });
}

function handleTopicCheckbox(event) {
  const topic = event.target.getAttribute("data-topic");
  if (!topic) return;
  state.readTopics[topic] = event.target.checked;
  saveState();
  updateProgress();
  updateNavCompletionFlags();
}

function renderSolvedExamples() {
  Object.entries(EXAMPLES).forEach(([topic, list]) => {
    const host = document.getElementById(`examples-${topic}`);
    if (!host) return;
    host.innerHTML = "";

    list.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "example-card";

      const head = document.createElement("div");
      head.className = "example-head";

      const title = document.createElement("div");
      title.className = "example-title";
      title.textContent = `Example ${index + 1}: ${item.title}`;

      const level = document.createElement("span");
      level.className = "example-level";
      level.textContent = `[${item.level}]`;

      head.appendChild(title);
      head.appendChild(level);

      const problem = document.createElement("p");
      problem.className = "example-problem";
      problem.textContent = `Problem Statement: ${item.problem}`;

      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = item.code;
      pre.appendChild(code);

      const explanation = document.createElement("p");
      explanation.className = "example-explanation";
      explanation.textContent = `Explanation: ${item.explanation}`;

      card.appendChild(head);
      card.appendChild(problem);
      card.appendChild(pre);
      card.appendChild(explanation);

      host.appendChild(card);
    });
  });
}

function openProblemModal(problemId) {
  const problem = PROBLEMS.find((item) => item.id === problemId);
  if (!problem) return;

  document.getElementById("problem-modal-title").textContent = `${problem.id}. ${problem.title}`;
  document.getElementById("problem-modal-topic").textContent = `${problem.topic} | ${problem.difficulty}`;
  document.getElementById("problem-modal-body").textContent = problem.statement;
  document.getElementById("problem-modal").classList.remove("hidden");
}

function closeProblemModal() {
  document.getElementById("problem-modal").classList.add("hidden");
}

function toggleProblemHint(problemId) {
  const hint = document.getElementById(`hint-${problemId}`);
  if (!hint) return;
  hint.classList.toggle("visible");
}

function toggleProblemSolved(problemId, button) {
  const solved = !!state.solvedProblems[problemId];
  state.solvedProblems[problemId] = !solved;
  button.textContent = solved ? "Mark Solved" : "Solved";
  button.classList.toggle("active", !solved);
  saveState();
}

function renderProblems() {
  const container = document.getElementById("problem-list");
  container.innerHTML = "";

  PROBLEMS.forEach((problem) => {
    const solved = !!state.solvedProblems[problem.id];

    const item = document.createElement("article");
    item.className = "problem-item";

    const top = document.createElement("div");
    top.className = "problem-top";

    const title = document.createElement("strong");
    title.textContent = `${problem.id}. ${problem.title}`;

    const meta = document.createElement("div");
    meta.className = "problem-meta";

    const topicPill = document.createElement("span");
    topicPill.className = "problem-pill";
    topicPill.textContent = problem.topic;

    const diffPill = document.createElement("span");
    diffPill.className = "problem-pill";
    diffPill.textContent = problem.difficulty;

    meta.appendChild(topicPill);
    meta.appendChild(diffPill);

    const actions = document.createElement("div");
    actions.className = "problem-actions";

    const solveBtn = document.createElement("button");
    solveBtn.className = "btn";
    solveBtn.type = "button";
    solveBtn.textContent = "Solve";
    solveBtn.addEventListener("click", () => openProblemModal(problem.id));

    const hintBtn = document.createElement("button");
    hintBtn.className = "btn";
    hintBtn.type = "button";
    hintBtn.textContent = "Show Hint";
    hintBtn.addEventListener("click", () => toggleProblemHint(problem.id));

    const solvedBtn = document.createElement("button");
    solvedBtn.className = `btn${solved ? " active" : ""}`;
    solvedBtn.type = "button";
    solvedBtn.textContent = solved ? "Solved" : "Mark Solved";
    solvedBtn.addEventListener("click", () => toggleProblemSolved(problem.id, solvedBtn));

    actions.appendChild(solveBtn);
    actions.appendChild(hintBtn);
    actions.appendChild(solvedBtn);

    const hint = document.createElement("p");
    hint.className = "hint-text";
    hint.id = `hint-${problem.id}`;
    hint.textContent = `Hint: ${problem.hint}`;

    top.appendChild(title);
    top.appendChild(meta);

    item.appendChild(top);
    item.appendChild(actions);
    item.appendChild(hint);

    container.appendChild(item);
  });
}

function parseDeclaration(input) {
  const cleaned = input.trim();

  const pointerToVar = cleaned.match(/^(int|char|float|double)\s*\*\s*([A-Za-z_]\w*)\s*=\s*&([A-Za-z_]\w*)\s*;?$/);
  if (pointerToVar) {
    return {
      type: `${pointerToVar[1]}*`,
      name: pointerToVar[2],
      isPointer: true,
      pointsTo: pointerToVar[3],
      value: null
    };
  }

  const pointerNull = cleaned.match(/^(int|char|float|double)\s*\*\s*([A-Za-z_]\w*)\s*=\s*NULL\s*;?$/i);
  if (pointerNull) {
    return {
      type: `${pointerNull[1]}*`,
      name: pointerNull[2],
      isPointer: true,
      pointsTo: null,
      value: "NULL"
    };
  }

  const normal = cleaned.match(/^(int|char|float|double)\s+([A-Za-z_]\w*)\s*=\s*(.+?)\s*;?$/);
  if (normal) {
    const parsedValue = normal[3].trim().replace(/;$/, "");
    return {
      type: normal[1],
      name: normal[2],
      isPointer: false,
      pointsTo: null,
      value: parsedValue
    };
  }

  return null;
}

function getTypeSize(type, isPointer) {
  if (isPointer || type.endsWith("*")) return 8;
  if (type === "char") return 1;
  if (type === "double") return 8;
  return 4;
}

function recalculateAddresses() {
  let offset = 0;
  state.memoryEntries.forEach((entry) => {
    entry.address = BASE_STACK_ADDRESS + offset;
    offset += getTypeSize(entry.type, entry.isPointer);
  });
}

function formatPointerValue(entry) {
  if (!entry.pointsTo) return "0x00000000";
  const target = state.memoryEntries.find((item) => item.name === entry.pointsTo);
  if (!target) return "UNRESOLVED";
  return `0x${target.address.toString(16).toUpperCase()}`;
}

function renderMemoryTable() {
  const tbody = document.querySelector("#memory-table tbody");
  tbody.innerHTML = "";

  state.memoryEntries.forEach((entry) => {
    const tr = document.createElement("tr");

    const tdAddress = document.createElement("td");
    tdAddress.textContent = `0x${entry.address.toString(16).toUpperCase()}`;

    const tdType = document.createElement("td");
    tdType.textContent = entry.type;

    const tdName = document.createElement("td");
    tdName.textContent = entry.name;

    const tdValue = document.createElement("td");
    if (entry.isPointer) {
      tdValue.textContent = formatPointerValue(entry);
    } else {
      tdValue.textContent = entry.value;
    }

    tr.appendChild(tdAddress);
    tr.appendChild(tdType);
    tr.appendChild(tdName);
    tr.appendChild(tdValue);

    tbody.appendChild(tr);
  });
}

function addMemoryEntry() {
  const input = document.getElementById("memory-input");
  const error = document.getElementById("memory-error");
  const raw = input.value.trim();

  error.textContent = "";
  if (!raw) return;

  const parsed = parseDeclaration(raw);
  if (!parsed) {
    error.textContent = "Could not parse declaration. Try: int a = 5; or int *p = &a;";
    return;
  }

  if (state.memoryEntries.some((entry) => entry.name === parsed.name)) {
    error.textContent = `Variable '${parsed.name}' already exists.`;
    return;
  }

  state.memoryEntries.push(parsed);
  recalculateAddresses();
  renderMemoryTable();
  saveState();
  input.value = "";
}

function clearMemoryEntries() {
  state.memoryEntries = [];
  renderMemoryTable();
  saveState();
  document.getElementById("memory-error").textContent = "";
}

function updateInterviewDisplay() {
  const timer = document.getElementById("interview-timer");
  const minutes = String(Math.floor(interviewSecondsLeft / 60)).padStart(2, "0");
  const seconds = String(interviewSecondsLeft % 60).padStart(2, "0");
  timer.textContent = `${minutes}:${seconds}`;
  timer.classList.toggle("warning", interviewSecondsLeft <= 300);
}

function startInterviewTimer() {
  clearInterval(interviewTimerId);
  interviewSecondsLeft = 30 * 60;
  updateInterviewDisplay();

  interviewTimerId = setInterval(() => {
    interviewSecondsLeft -= 1;
    updateInterviewDisplay();
    if (interviewSecondsLeft <= 0) {
      clearInterval(interviewTimerId);
      document.getElementById("interview-timer").textContent = "TIME UP";
    }
  }, 1000);
}

function toggleInterviewMode() {
  const btn = document.getElementById("interview-btn");

  state.interviewMode = !state.interviewMode;
  document.body.classList.toggle("interview-active", state.interviewMode);
  btn.classList.toggle("active", state.interviewMode);
  btn.textContent = state.interviewMode ? "Exit Interview" : "Interview Mode";

  if (state.interviewMode) {
    startInterviewTimer();
    document.getElementById("interview-timer").style.display = "block";
    showSection("practice");
  } else {
    clearInterval(interviewTimerId);
    document.getElementById("interview-timer").style.display = "none";
  }

  saveState();
}

function setupEvents() {
  document.getElementById("theme-btn").addEventListener("click", toggleTheme);
  document.getElementById("print-btn").addEventListener("click", () => window.print());
  document.getElementById("interview-btn").addEventListener("click", toggleInterviewMode);
  document.getElementById("sidebar-toggle-btn").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => showSection(item.getAttribute("data-target")));
  });

  document.querySelectorAll("input[data-topic]").forEach((cb) => {
    cb.addEventListener("change", handleTopicCheckbox);
  });

  document.querySelectorAll(".next-btn").forEach((btn) => {
    btn.addEventListener("click", () => showSection(btn.getAttribute("data-next")));
  });

  document.getElementById("memory-add-btn").addEventListener("click", addMemoryEntry);
  document.getElementById("memory-clear-btn").addEventListener("click", clearMemoryEntries);
  document.getElementById("memory-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") addMemoryEntry();
  });

  document.getElementById("close-modal-btn").addEventListener("click", closeProblemModal);
  document.getElementById("problem-modal").addEventListener("click", (event) => {
    if (event.target.id === "problem-modal") closeProblemModal();
  });
}

function restoreInterviewMode() {
  if (!state.interviewMode) return;
  document.body.classList.add("interview-active");
  const btn = document.getElementById("interview-btn");
  btn.classList.add("active");
  btn.textContent = "Exit Interview";
  startInterviewTimer();
  document.getElementById("interview-timer").style.display = "block";
}

function ensureCounts() {
  const totalExamples = Object.values(EXAMPLES).reduce((acc, arr) => acc + arr.length, 0);
  if (totalExamples < 70) {
    console.error("Expected at least 70 examples but found", totalExamples);
  }
  if (PROBLEMS.length < 40) {
    console.error("Expected at least 40 problems but found", PROBLEMS.length);
  }
}

function init() {
  loadState();
  setTheme(state.theme || "light");

  setupEvents();
  renderSolvedExamples();
  renderProblems();
  restoreTopicCheckboxes();
  updateProgress();
  updateNavCompletionFlags();

  recalculateAddresses();
  renderMemoryTable();

  restoreInterviewMode();
  ensureCounts();
}

init();
