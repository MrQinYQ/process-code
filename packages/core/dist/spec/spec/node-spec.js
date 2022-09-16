"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var core_1 = require("@process-code/core");
var rxjs_1 = require("rxjs");
describe('node test', function () {
    it('simple use', function (done) {
        var sourceData = [{
                name: '测试1',
                id: '1',
                address: '地址',
                link: 'https://bing.com',
                isActive: false,
                customerNum: 51
            }, {
                name: '测试2',
                id: '2',
                address: '地址',
                link: 'https://bing.com',
                isActive: true,
                customerNum: 101
            }];
        var targetData = [{
                name: '测试1',
                id: '1',
                address: '地址',
                link: 'https://bing.com',
                isActive: false,
                customerNum: 51,
                isMore: false
            }, {
                name: '测试2',
                id: '2',
                address: '地址',
                link: 'https://bing.com',
                isActive: true,
                customerNum: 101,
                isMore: true
            }];
        var listNode = new core_1.DataNode();
        var t1 = new core_1.ProcessNode(rxjs_1.map(function (list) {
            return list.map(function (item) {
                return __assign(__assign({}, item), { isMore: item.customerNum > 100 });
            });
        }));
        t1.setInputNode(listNode);
        var loadingNode = new core_1.DataNode(false);
        // 点击事件流
        var clickEventNode = new core_1.DataNode();
        // 防连点
        var ce1 = new core_1.ProcessNode(rxjs_1.debounceTime(300));
        ce1.setInputNode(clickEventNode);
        // loading状态不继续触发后续
        var ce4 = new core_1.ProcessNode(rxjs_1.filter(function (value) { return (loadingNode.getObservable().value === false); }));
        ce4.setInputNode(ce1);
        // 构建参数
        var ce3 = new core_1.ProcessNode(rxjs_1.map(function (e) {
            return {
                name: '123',
                id: '1'
            };
        }));
        ce3.setInputNode(ce4);
        // 请求数据
        var ce2 = new core_1.ProcessNode(rxjs_1.switchMap(function (e) {
            // do something
            return new rxjs_1.Observable(function (subscriber) {
                var timeoutId = setTimeout(function () {
                    subscriber.next(sourceData);
                    subscriber.complete();
                }, 1000);
                return function () {
                    clearTimeout(timeoutId);
                };
            }).pipe(rxjs_1.tap({
                subscribe: function () {
                    // console.log('subscribe')
                    loadingNode.setData(true);
                },
                unsubscribe: function () {
                    // console.log('unsubscribe')
                    loadingNode.setData(false);
                },
                complete: function () {
                    // console.log('complete')
                    loadingNode.setData(false);
                }
            }));
        }));
        ce2.setInputNode(ce3);
        // 更新数据
        ce2.getObservable().subscribe(function (value) {
            listNode.setData(value);
        });
        // 判定数据已更新
        t1.getObservable().subscribe(function (value) {
            try {
                chai_1.expect(value).to.deep.equal(targetData);
                process.nextTick(function () {
                    chai_1.expect(loadingNode.getObservable().value).to.equal(false);
                    done();
                });
            }
            catch (e) {
                // console.error(e)
                done(e);
            }
        });
        // 触发点击事件
        clickEventNode.setData({});
        setTimeout(function () {
            clickEventNode.setData({});
        }, 100);
        setTimeout(function () {
            clickEventNode.setData({});
        }, 500);
    });
    it('branch test', function (done) {
        var dataNode = new core_1.DataNode();
        var pNode1 = new core_1.ProcessNode(rxjs_1.filter(function (value) { return value.age > 18; }));
        var pNode2 = new core_1.ProcessNode(rxjs_1.filter(function (value) { return value.age <= 18; }));
        dataNode.setOutputNode(pNode1, pNode2);
        pNode1.getObservable().subscribe(function (value) {
            done('不应该走到这个分支');
        });
        pNode2.getObservable().subscribe(function (value) {
            done();
        });
        dataNode.setData({
            name: '美少女',
            age: 18
        });
    });
    it('branch test2', function (done) {
        var dataNode = new core_1.DataNode();
        var pNode1 = new core_1.ProcessNode(rxjs_1.filter(function (value) { return value.age > 18; }));
        var pNode2 = new core_1.ProcessNode(rxjs_1.filter(function (value) { return value.age <= 18; }));
        dataNode.setOutputNode(pNode1, pNode2);
        pNode1.getObservable().subscribe(function (value) {
            done();
        });
        pNode2.getObservable().subscribe(function (value) {
            done('不应该走到这个分支');
        });
        dataNode.setData({
            name: '老阿姨',
            age: 20
        });
    });
    it('merge test', function (done) {
        var dataNode = new core_1.DataNode();
        var pNode1 = new core_1.ProcessNode(rxjs_1.filter(function (value) { return value.age > 18; }));
        var pNode2 = new core_1.ProcessNode(rxjs_1.filter(function (value) { return value.age <= 18; }));
        dataNode.setOutputNode(pNode2, pNode1);
        pNode1.getObservable().subscribe(function (value) {
            console.log('pnode1', value);
        });
        pNode2.getObservable().subscribe(function (value) {
            console.log('pnode2', value);
            done('way is wrong');
        });
        var mergeNode = new core_1.ProcessNode(rxjs_1.map(function (value) {
            value.age = 18;
            return value;
            // return {
            //     ...value,
            //     age: 18
            // };
        }));
        mergeNode.setInputNode(pNode1, pNode2);
        mergeNode.getObservable().subscribe(function (value) {
            console.log(value);
            chai_1.expect(value.age).to.equal(18);
            done();
        });
        dataNode.setData({
            name: '大龄美少女',
            age: 19
        });
    });
});
