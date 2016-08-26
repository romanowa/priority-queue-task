const Node = require('./node');

class MaxHeap {
    constructor() {
        this.root = null;
        this.parentNodes = [];
    }

    push(data, priority) {
        let nodeToPush = new Node(data, priority);
        this.insertNode(nodeToPush);
        this.shiftNodeUp(nodeToPush);
    }

    pop() {
        // 1) detach root
        // 2) restore root from last node
        // 3) shift new root down
        // 4) return detached root data
        if (!this.isEmpty()) {
            let detachedRoot = this.detachRoot();
            this.restoreRootFromLastInsertedNode(detachedRoot);
            this.shiftNodeDown(this.root);
            return detachedRoot.data;
        }
    }

    detachRoot() {
        // 1) this.root = null
        // 2) remove root from parentNodes
        // 3) return root
        let detachedRoot = this.root;
        if (this.root.left) {
            this.root.left.parent = null;
        }
        if (this.root.right) {
            this.root.right.parent = null;
        }
        this.root = null;
        if (detachedRoot === this.parentNodes[0]) {
            this.parentNodes.shift(); // remove from parentNodes
        }
        return detachedRoot;
    }

    restoreRootFromLastInsertedNode(detached) {
        // 1) new root = last node
        // 2) remove last node
        // 3) update parentNodes
        if (this.parentNodes.length === 0) {
            return;
        }
        let lastNode = this.parentNodes[this.parentNodes.length - 1];
        this.root = lastNode;
        this.parentNodes.pop(); // removes the last element from parentNodes
        // check if we need to add last node parent to parentNodes (if we just removed its right child - it is now ready to be a parent)
        let lastNodeParent = lastNode.parent;
        if (lastNodeParent && lastNodeParent.right) {
            this.parentNodes.unshift(lastNodeParent);
        }
        // remove the last node from the heap
        lastNode.remove();
        // attach detached children to new root if they are present and were not just moved to the root
        if (detached.left != this.root) {
            this.root.left = detached.left;
            if (this.root.left) {
                this.root.left.parent = this.root;
            }
        }
        if (detached.right != this.root) {
            this.root.right = detached.right;
            if (this.root.right) {
                this.root.right.parent = this.root;
            }
        }
        // add new root to parentNodes if necessary
        if (!this.root.right) {
            this.parentNodes.unshift(this.root);
        }
    }

    size() {
        if (this.parentNodes.length < 2) {
            return this.parentNodes.length;
        } else {
            let parentNodesLength = this.parentNodes.length;
            let lastNodeIndex = parentNodesLength - 1;
            let currentHeapSize = 0;
            if (this.parentNodes[lastNodeIndex] === this.parentNodes[lastNodeIndex].parent.left) {
                currentHeapSize = parentNodesLength * 2 - 2;
            } else {
                currentHeapSize = parentNodesLength * 2 - 1;
            }
            return currentHeapSize;
        }
    }

    isEmpty() {
        return this.parentNodes.length === 0;
    }

    clear() {
        this.root = null;
        this.parentNodes = [];
    }

    insertNode(node) {
        if (this.parentNodes.length === 0) {
            this.root = node;
            this.parentNodes.push(this.root);
        } else {
            this.parentNodes[0].appendChild(node);
            if (this.parentNodes[0].right) {
                this.parentNodes.shift();
            }
            this.parentNodes.push(node);
        }
    }

    shiftNodeUp(node) {
        let parentNode = node.parent;
        if (parentNode && node.priority > parentNode.priority) {
            node.swapWithParent();
            // parentNodes array update
            let nodeIndex = -1;
            let parentNodeIndex = -1;
            for (let i = 0; i < this.parentNodes.length; i++) {
                if (this.parentNodes[i] === node) {
                    nodeIndex = i;
                }
                if (this.parentNodes[i] === parentNode) {
                    parentNodeIndex = i;
                }
            }
            if (nodeIndex >= 0 && parentNodeIndex >= 0) {
                // both nodes are in parentNodes => swap them in array
                this.parentNodes[nodeIndex] = parentNode;
                this.parentNodes[parentNodeIndex] = node;
            } else if (nodeIndex >= 0) {
                // only one node is in array => replace it with the other
                this.parentNodes[nodeIndex] = parentNode;
            }
            this.shiftNodeUp(node);
        }
        if (!parentNode) {
            this.root = node;
        }
    }

    shiftNodeDown(node) {
        if (!this.root) {
            return;
        }
        let childToReplace;
        // choose which child to replace
        if (node.left && node.right) {
            if (node.right.priority > node.left.priority) {
                childToReplace = node.right;
            } else {
                childToReplace = node.left;
            }
        } else if (node.left) {
            childToReplace = node.left;
        }
        if (childToReplace && node.priority < childToReplace.priority) {
            childToReplace.swapWithParent();
            // need to update root right after swapping otherwise the following swapping won't work correctly
            if (!childToReplace.parent) {
                this.root = childToReplace;
            }
            // parentNodes array update
            let nodeIndex = -1;
            let childToReplaceIndex = -1;
            for (let i = 0; i < this.parentNodes.length; i++) {
                if (this.parentNodes[i] === node) {
                    nodeIndex = i;
                }
                if (this.parentNodes[i] === childToReplace) {
                    childToReplaceIndex = i;
                }
            }
            if (nodeIndex >= 0 && childToReplaceIndex >= 0) {
                // both nodes are in parentNodes => swap them in array
                this.parentNodes[nodeIndex] = childToReplace;
                this.parentNodes[childToReplaceIndex] = node;
            } else if (childToReplaceIndex >= 0) {
                // only one node is in array => replace it with the other one
                this.parentNodes[childToReplaceIndex] = node;
            }
            this.shiftNodeDown(node);
        }
    }
}

module.exports = MaxHeap;
