class Node {
    constructor(data, priority) {
        this.data = data;
        this.priority = priority;
        this.parent = null;
        this.left = null;
        this.right = null;
    }

    appendChild(node) {
        if (!this.left) {
            this.left = node;
            node.parent = this;
        } else if (!this.right) {
            this.right = node;
            node.parent = this;
        }
    }

    removeChild(node) {
        if (node === this.left) {
            this.left = null;
            node.parent = null;
        } else if (node === this.right) {
            this.right = null;
            node.parent = null;
        } else {
            let thr = require('throw');
            thr('Passed node is not a child of this node');
        }
    }

    remove() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    swapWithParent() {
        if (this.parent === null) {
            return;
        }
        let parentNode = this.parent;
        let grandpaNode = null;
        let siblingNode = null;
        let leftChildNode = this.left;
        let rightChildNode = this.right;
        let currentNodeIsLeft = false;

        // 1) grandpa modification
        if (parentNode.parent) {
            grandpaNode = parentNode.parent;
            if (this.parent === grandpaNode.left) {
               grandpaNode.left = this;
            } else {
               grandpaNode.right = this;
            }
        }

        // 2) sibling modification
        if (this === parentNode.left) {
            currentNodeIsLeft = true;
            if (parentNode.right) {
                siblingNode = parentNode.right;
                siblingNode.parent = this;
            }
        } else {
            siblingNode = parentNode.left;
            siblingNode.parent = this;
        }

        // 3) parent modification
        parentNode.parent = this;
        parentNode.left = this.left;
        parentNode.right = this.right;

        // 4) children modification
        if (leftChildNode) {
            leftChildNode.parent = parentNode;
        }
        if (rightChildNode) {
            rightChildNode.parent = parentNode;
        }

        // 5) current node modification
        this.parent = grandpaNode;
        if (currentNodeIsLeft) {
            this.left = parentNode;
            this.right = siblingNode;
        } else {
            this.right = parentNode;
            this.left = siblingNode;
        }
    }
}

module.exports = Node;
