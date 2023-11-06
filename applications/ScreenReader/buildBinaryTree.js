/*
 * This is taken from the binary-tree example provided by ScreenReader. 
 * It is the necessary components to build the navigation tree from the
 * given text stream.
 * 
 * Theoretically we could pass in our own text string (while data points don't
 * really make sense here user supplied strings could) and build the tree
 * to navigate. You could also use their html and other code to have it
 * be operable on a html page and navigatable.
 */

  // Edit this to change the binary tree
  strArray = ["A line chart of monthly stock prices of Apple (AAPL), Amazon (AMZN), Google (GOOG), IBM (IBM), and Microsoft (MSFT) as separate lines. X axis title is Date, ranging from January 1 2000 to March 1 2010, major increments at 2 years. Y axis title is Price, ranging from 0 to 800 USD, major increments at 200 dollars. For more detail, press to go down.",'Date Range Jan 1 2000 to Jul 1 2004. AAPL average price $12.81, standard deviation $6.77, AMZN average price $30.16, standard deviation $17.49, IBM average price $86.25, standard deviation $13.24, MSFT average price $24.15, standard deviation $4.97. For more detail, press to go down, two children.', 'Date Range Aug 1 2004 to Mar 1 2010. AAPL average price $106.73, standard deviation $56.70, AMZN average price $62.40, standard deviation $28.31, GOOG average price $415.87, standard deviation $135.07, IBM average price $95.31, standard deviation $17.83, MSFT average price $25.21, standard deviation $3.65. For more detail, press to go down, two children.', 'Date Range Jan 1 2000 to April 1 2002. AAPL average price $15.37, standard deviation $8.40, AMZN average price $25.98, standard deviation $19.43, IBM average price $95.82, standard deviation $9.61, MSFT average price $26.99, standard deviation $5.52. For more detail, press to go down, two children.', 'Date Range May 1 2002 to Jul 1 2004. AAPL average price $10.15, standard deviation $6.59, AMZN average price $34.51, standard deviation $17.00, IBM average price $76.33, standard deviation $13.22, MSFT average price $21.20, standard deviation $4.52. For more detail, press to go down, two children.', 'Date Range Aug 1 2004 to May 1 2007. AAPL average price $60.45, standard deviation $24.59, AMZN average price $40.04, standard deviation $8.09, GOOG average price $341.07, standard deviation $117.72, IBM average price $81.26, standard deviation $8.13, MSFT average price $24.71, standard deviation $2.12. For more detail, press to go down, two children.', 'Date Range June 1 2007 to Mar 1 2010. AAPL average price $153.01, standard deviation $38.86, AMZN average price $84.76, standard deviation $23.06, GOOG average price $490.67, standard deviation $107.96, IBM average price $109.36, standard deviation $13.15, MSFT average price $25.72, standard deviation $4.69. For more detail, press to go down, two children.', 'Date Range Jan 1 2000 to Feb 1 2001. AAPL average price $20.07, standard deviation $9.84, AMZN average price $39.62, standard deviation $19.27, IBM average price $96.69, standard deviation $10.19, MSFT average price $28.92, standard deviation $6.92. ', 'Date Range Mar 1 2001 to Apr 1 2002. AAPL average price $10.67, standard deviation $1.47, AMZN average price $12.33, standard deviation $3.42, IBM average price $94.94, standard deviation $9.29, MSFT average price $25.06, standard deviation $2.69. ', 'Date Range May 1 2002 to Jun 1 2003. AAPL average price $8.08, standard deviation $1.29, AMZN average price $22.30, standard deviation $7.16, IBM average price $70.89, standard deviation $6.99, MSFT average price $20.48, standard deviation $1.42. ', 'Date Range Aug 1 2003 to Jul 1 2004. AAPL average price $12.38, standard deviation $2.07, AMZN average price $47.66, standard deviation $5.29, IBM average price $82.20, standard deviation $4.62, MSFT average price $21.97, standard deviation $0.89. ', 'Date Range Aug 1 2004 to Dec 1 2005. AAPL average price $41.57, standard deviation $14.98, AMZN average price $39.96, standard deviation $5.21, GOOG average price $249.12, standard deviation $92.25, IBM average price $79.32, standard deviation $6.48, MSFT average price $23.74, standard deviation $0.96. ', 'Date Range Jan 1 2006 to May 1 2007. AAPL average price $79.34, standard deviation $16.27, AMZN average price $40.12, standard deviation $10.39, GOOG average price $433.03, standard deviation $45.86, IBM average price $83.21, standard deviation $9.29, MSFT average price $25.68, standard deviation $2.52. ', 'Date Range June 1 2007 to Oct 1 2008. AAPL average price $152.93, standard deviation $28.39, AMZN average price $78.03, standard deviation $9.86, GOOG average price $533.30, standard deviation $99.09, IBM average price $110.02, standard deviation $8.84, MSFT average price $27.99, standard deviation $3.35. ', 'Date Range Nov 1 2008 to Mar 1 2010. AAPL average price $153.08, standard deviation $48.05, AMZN average price $91.49, standard deviation $30.05, GOOG average price $448.03, standard deviation $101.78, IBM average price $108.70, standard deviation $16.66, MSFT average price $23.44, standard deviation $4.81. '];




class BinaryTreeNode {
    constructor(data)
    {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

var nodeArray = [null];
var arrIdx = 1;

var treeRoot = null;
initBinTree();

function initBinTree() {
    var currNode = null;
    var bTreeNode = null;
    for (i = 0; i < strArray.length; i++){
      bTreeNode = new BinaryTreeNode(strArray[i]);

      if (i == 0) {
        treeRoot = bTreeNode;
      }

      nodeArray.push(bTreeNode);

    }

    // assign children

    for (j = 1; j < nodeArray.length; j++) {
      // assign left and right
      if (2 * j + 1 < nodeArray.length) {
        currNode = nodeArray[j];
        currNode.left = nodeArray[2 * j];
        currNode.right = nodeArray[2 * j + 1];
      }
      // assign only left
      else if (2 * j < nodeArray.length) {
        currNode = nodeArray[j];
        currNode.left = nodeArray[2 * j];
      }
    }
}

console.log(treeRoot)