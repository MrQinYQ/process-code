import { Subject, Subscriber, Subscription } from 'rxjs';

export class StateSubject<T> extends Subject<T> {

    constructor(private _value: T) {
        super();
    }
  
    get value(): T {
        return this.getValue();
    }
  
    /** @internal */
    protected _subscribe(subscriber: Subscriber<T>): Subscription {
        // @ts-ignore
        const subscription = super._subscribe(subscriber);
        !subscription.closed && this._value && subscriber.next(this._value);
        return subscription;
    }
  
    getValue(): T {
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
