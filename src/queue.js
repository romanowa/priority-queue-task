const MaxHeap = require('./max-heap.js');

class PriorityQueue {
    constructor(maxSize) {
        this.heap = new MaxHeap();
        if (!maxSize) {
            this.maxSize = 30;
        } else {
            this.maxSize = maxSize;
        }
    }

    push(data, priority) {
        if (this.heap.size() >= this.maxSize) {
            let thr = require('throw');
            thr('Queue has max size');
        } else {
            this.heap.push(data, priority);
        }
    }

    shift() {
        if (this.isEmpty()) {
            let thr = require('throw');
            thr('Queue is empty');
        } else {
            return this.heap.pop();
        }
    }

    size() {
        return this.heap.size();
    }

    isEmpty() {
        return this.heap.isEmpty();
    }
}

module.exports = PriorityQueue;
