import { Subject, Subscriber, Subscription } from 'rxjs';

interface NoInitValueInterface<T> {
    get value(): T | undefined;
    getValue(): T | undefined;
}

interface HasInitValueInterface<T> {
    get value(): T;
    getValue(): T;
}

interface StateSubjectInterface<T> {
    new (): NoInitValueInterface<T>;
    new (value: T): HasInitValueInterface<T>;
};

class _StateSubject<T> extends Subject<T> {

    constructor(private _value?: T) {
        super();
    }
  
    get value(): T | undefined {
        return this.getValue();
    }
  
    /** @internal */
    protected _subscribe(subscriber: Subscriber<T>): Subscription {
        // @ts-ignore
        const subscription = super._subscribe(subscriber);
        !subscription.closed && this._value && subscriber.next(this._value);
        return subscription;
    }
  
    getValue(): T | undefined {
        const { hasError, thrownError, _value } = this;
        if (hasError) {
            throw thrownError;
        }
        // @ts-ignore
        this._throwIfClosed();
        return _value;
    }
  
    next(value: T): void {
        super.next((this._value = value));
    }
}

function CreateInstance<T>(value?: T) {
    if (value === undefined) {
        return new _StateSubject<T>() as NoInitValueInterface<T>;
    } else {
        return new _StateSubject<T>(value) as HasInitValueInterface<T>;
    }
}

export const StateSubject = function createInstance<T>(value?: T) {
    if (value === undefined) {
        return 
    }
}