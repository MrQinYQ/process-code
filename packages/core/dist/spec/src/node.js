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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
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
        var inputObservable = rxjs_1.merge.apply(void 0, __spreadArray([], __read(nodes.map(function (item) { return item.getObservable(); }))));
        this.observable = this.process(inputObservable);
    };
    AbstractNode.prototype.setOutputNode = function () {
        var e_1, _a;
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
        try {
            for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var node = nodes_1_1.value;
                node.setInputNode(this);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
            }
            finally { if (e_1) throw e_1.error; }
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
