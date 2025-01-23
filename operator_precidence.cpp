#include <iostream>
#include <stack>
#include <cctype>
#include <string>
using namespace std;

// Function to return precedence of operators
int precedence(char op) {
    if (op == '+' || op == '-') return 1;
    if (op == '*' || op == '/') return 2;
    return 0;
}

// Function to apply the operator to two operands and return the result
int applyOp(int a, int b, char op, bool &errorFlag) {
    if (op == '/' && b == 0) {
        errorFlag = true;  // Division by zero
        return 0;
    }
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
    }
    return 0;
}

// Function to validate the expression
bool validateExpression(const string &exp) {
    int openParentheses = 0;
    bool lastWasOperator = true;  // Tracks if the last character was an operator
    for (int i = 0; i < exp.length(); i++) {
        char ch = exp[i];
        
        if (isspace(ch)) continue;  // Skip spaces
        
        if (isdigit(ch)) {
            lastWasOperator = false;
        } else if (ch == '(') {
            openParentheses++;
            lastWasOperator = true;
        } else if (ch == ')') {
            openParentheses--;
            if (openParentheses < 0) return false;  // More closing parentheses than opening
            lastWasOperator = false;
        } else if (ch == '+' || ch == '-' || ch == '*' || ch == '/') {
            if (lastWasOperator) return false;  // Two operators in a row
            lastWasOperator = true;
        } else {
            // Invalid character
            return false;
        }
    }
    
    // Ensure parentheses are balanced and expression doesn't end with an operator
    return openParentheses == 0 && !lastWasOperator;
}

// Function to evaluate the expression
int evaluateExpression(const string &exp, bool &errorFlag) {
    stack<int> values;   // Stack to store numbers
    stack<char> ops;     // Stack to store operators
    
    for (int i = 0; i < exp.length(); i++) {
        if (isspace(exp[i])) continue;
        
        if (isdigit(exp[i])) {
            int val = 0;
            while (i < exp.length() && isdigit(exp[i])) {
                val = val * 10 + (exp[i] - '0');
                i++;
            }
            values.push(val);
            i--;  // Adjust for the extra increment in the loop
        } else if (exp[i] == '(') {
            ops.push(exp[i]);
        } else if (exp[i] == ')') {
            while (!ops.empty() && ops.top() != '(') {
                if (values.size() < 2) {
                    errorFlag = true;
                    return 0;
                }
                int val2 = values.top();
                values.pop();
                int val1 = values.top();
                values.pop();
                char op = ops.top();
                ops.pop();
                values.push(applyOp(val1, val2, op, errorFlag));
                if (errorFlag) return 0;  // Division by zero
            }
            if (!ops.empty()) ops.pop();  // Remove '(' from stack
        } else if (exp[i] == '+' || exp[i] == '-' || exp[i] == '*' || exp[i] == '/') {
            while (!ops.empty() && precedence(ops.top()) >= precedence(exp[i])) {
                if (values.size() < 2) {
                    errorFlag = true;
                    return 0;
                }
                int val2 = values.top();
                values.pop();
                int val1 = values.top();
                values.pop();
                char op = ops.top();
                ops.pop();
                values.push(applyOp(val1, val2, op, errorFlag));
                if (errorFlag) return 0;  // Division by zero
            }
            ops.push(exp[i]);
        }
    }
    
    while (!ops.empty()) {
        if (values.size() < 2) {
            errorFlag = true;
            return 0;
        }
        int val2 = values.top();
        values.pop();
        int val1 = values.top();
        values.pop();
        char op = ops.top();
        ops.pop();
        values.push(applyOp(val1, val2, op, errorFlag));
        if (errorFlag) return 0;  // Division by zero
    }
    
    return values.empty() ? 0 : values.top();
}

int main() {
    string exp;
    cout << "Enter the mathematical expression: ";
    getline(cin, exp);
    
    if (!validateExpression(exp)) {
        cout << "Invalid expression. Please check the syntax." << endl;
        return 1;  // Exit with an error code
    }
    
    bool errorFlag = false;
    int result = evaluateExpression(exp, errorFlag);
    
    if (errorFlag) {
        cout << "Error: Division by zero or malformed expression." << endl;
        return 1;
    }
    
    cout << "Result: " << result << endl;
    return 0;
}