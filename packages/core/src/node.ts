import { merge, Observable, OperatorFunction } from "rxjs";
import { StateSubject } from './subject';

export interface INode<I, O> {
    getObservable: () => Observable<O>;
    setInputNode: (...nodes: INode<any, I>[]) => void;
    setOutputNode: (...nodes: INode<O, any>[]) => void;
}

export abstract class AbstractNode<I, O> implements INode<I, O> {
    protected abstract process(inputObservable: Observable<I>): Observable<O>;
    protected observable: Observable<O> | undefined;
    getObservable() {
        if (!this.observable) {
            throw new Error('observable is not init')
        }
        return this.observable
    }
    setInputNode(...nodes: INode<any, I>[]) {
        if (!nodes.length) {
            throw new Error('input nodes is empty');
        }
        const inputObservable: Observable<I> = merge(...nodes.map(item => item.getObservable()))
        this.observable = this.process(inputObservable)
    }
    setOutputNode(...nodes: INode<O, any>[]) {
        if (!this.observable) {
            throw new Error('observable is not init')
        }
        if (!nodes.length) {
            throw new Error('output nodes is empty');
        }
        for (const node of nodes) {
            node.setInputNode(this)
        }
    }
}

export class DataNode<T> extends AbstractNode<T, T> {
    protected observable: StateSubject<T>;
    constructor(initData: T) {
        super();
        this.observable = new StateSubject<T>(initData);
    }
    protected process(inputObservable: Observable<T>): Observable<T> {
        inputObservable.subscribe(this.observable);
        return this.observable;
    }
    setData(data: T) {
        this.observable.next(data);
    }
    getData() {
        return this.observable.getValue();
    }
}

export class ProcessNode<I, O> extends AbstractNode<I, O> {
    protected process(inputObservable: Observable<I>): Observable<O> {
        return this.processFn(inputObservable);
    }
    constructor(private processFn: OperatorFunction<I, O>) {
        super();
    }
}

export class DataProcessNode<I, O> extends AbstractNode<I, O> {
    protected observable: StateSubject<O>;
    protected process(inputObservable: Observable<I>): Observable<O> {
        this.processFn(inputObservable).subscribe(this.observable)
        return this.observable;
    }
    constructor(private processFn: OperatorFunction<I, O>, initData: O) {
        super();
        this.observable = new StateSubject<O>(initData);
    }
    setData(data: O) {
        this.observable.next(data);
    }
    getData() {
        return this.observable.getValue();
    }
}
