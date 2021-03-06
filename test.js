import { deepStrictEqual as test } from 'assert'
import { classeNoMemo } from './index.js'

const pass = _ => _
const applyDallas = (options, props) =>
  classeNoMemo(options, pass)(Object.freeze(props))

/* APPLY CLASSNAME */
console.log('it should apply className')
test(applyDallas({ className: 'hello' }, {}), { className: 'hello' })

console.log('it should apply className (using string shorthand)')
test(applyDallas('hello', {}), { className: 'hello' })

console.log('it should concatenate to with existing className')
test(applyDallas('hello', { className: 'world' }), {
  className: 'world hello',
})

/* APPLY CLASSNAMES */
console.log('it should apply classNames')
const classNames = ['hello', 'world']
const expected = { className: classNames.join(' ') }
test(applyDallas({ classNames }, {}), expected)

console.log('it should apply classNames (using array shorthand)')
test(applyDallas(classNames, {}), expected)

console.log('it should concatenate to with existing className')
test(applyDallas(classNames, { className: 'my' }), {
  className: 'my hello world',
})

console.log('it should only modify props on change')
test(applyDallas(classNames, expected) === expected, true)

/* APPLY FLAGS */
console.log('it should apply a single flag')
test(applyDallas({ x: 'x' }, { x: true }), { x: true, className: 'x' })

console.log('it should apply multiple flags')
test(applyDallas({ x: 'x', d: 'd' }, { x: true, d: true }), {
  x: true,
  d: true,
  className: 'x d',
})

console.log(
  'it should apply a single flag and concatenate with existing className',
)
test(applyDallas({ x: 'x' }, { x: true, className: 'a' }), {
  x: true,
  className: 'a x',
})

console.log(
  'it should apply multiple flags and concatenate with existing className',
)
test(applyDallas({ x: 'x', d: 'd' }, { x: true, d: true, className: 'a' }), {
  x: true,
  d: true,
  className: 'a x d',
})

console.log('it should only apply specified flags')
test(applyDallas({ x: 'x', d: 'd' }, { d: true, className: 'a' }), {
  d: true,
  className: 'a d',
})

console.log('it should not modify the object if no flags are applied')
test(applyDallas({ x: 'x', d: 'd' }, expected) === expected, true)

/* APPLY MATCHER */
console.log('it should apply matcher')
const matcher = { status: { online: 'on', offline: 'off' } }
test(applyDallas(matcher, { status: 'online' }), {
  status: 'online',
  className: 'on',
})

console.log('it should apply matcher and concatenate className')
test(applyDallas(matcher, { status: 'offline', className: 'a' }), {
  status: 'offline',
  className: 'a off',
})

console.log('it should not change the props when not matching')
test(applyDallas(matcher, expected) === expected, true)

/* COMBINE ALL */
const allOptions = {
  classNames,
  disabled: 'is-disabled',
  color: {
    primary: 'color-blue',
    warning: 'color-orange',
    error: 'color-red',
  },
}

console.log('we shoud be able to combine all the options')
test(
  applyDallas(allOptions, {
    className: 'my-class',
    disabled: true,
    color: 'primary',
  }).className,
  'my-class hello world is-disabled color-blue',
)

console.log('if should return the same props if no changes were nescessary')
test(applyDallas(allOptions, expected) === expected, true)
