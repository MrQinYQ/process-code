"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessNode = exports.DataNode = exports.StartNode = exports.AbstractNode = void 0;
var rxjs_1 = require("rxjs");
var AbstractNode = /** @class */ (function () {
    function AbstractNode() {
    }
    AbstractNode.prototype.getObservable = function () {
        if (!this.observable) {
            throw new Error('observable is not init');
        }
        return this.observable;
    };
    AbstractNode.prototype.setInputNode = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        if (!nodes.length) {
            console.error('input nodes is empty');
            return;
        }
        var inputObservable = rxjs_1.merge.apply(void 0, nodes.map(function (item) { return item.getObservable(); }));
        this.observable = this.process(inputObservable);
    };
    AbstractNode.prototype.setOutputNode = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        if (!this.observable) {
            console.error('observable is not init');
            return;
        }
        if (!nodes.length) {
            console.error('output nodes is empty');
            return;
        }
        for (var _a = 0, nodes_1 = nodes; _a < nodes_1.length; _a++) {
            var node = nodes_1[_a];
            node.setInputNode(this);
        }
    };
    return AbstractNode;
}());
exports.AbstractNode = AbstractNode;
var StartNode = /** @class */ (function (_super) {
    __extends(StartNode, _super);
    function StartNode() {
        return _super.call(this) || this;
    }
    /**
     * start node without process
     * @param inputObservable
     * @returns
     */
    StartNode.prototype.process = function (inputObservable) {
        return inputObservable;
    };
    return StartNode;
}(AbstractNode));
exports.StartNode = StartNode;
var DataNode = /** @class */ (function (_super) {
    __extends(DataNode, _super);
    function DataNode(initData) {
        var _this = _super.call(this) || this;
        if (initData !== undefined) {
            _this.observable = new rxjs_1.BehaviorSubject(initData);
        }
        else {
            _this.observable = new rxjs_1.Subject();
        }
        return _this;
    }
    DataNode.prototype.setData = function (data) {
        this.observable.next(data);
    };
    return DataNode;
}(StartNode));
exports.DataNode = DataNode;
var ProcessNode = /** @class */ (function (_super) {
    __extends(ProcessNode, _super);
    function ProcessNode(processFn) {
        var _this = _super.call(this) || this;
        _this.processFn = processFn;
        return _this;
    }
    ProcessNode.prototype.process = function (inputObservable) {
        return this.processFn(inputObservable);
    };
    return ProcessNode;
}(AbstractNode));
exports.ProcessNode = ProcessNode;
