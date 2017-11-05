import React from 'react'
import rulesBuilder from 'reta/rules-builder'
import componentBuilder from 'reta/component-builder'
import styleRules from './style-rules'

export const buildRules = rulesBuilder(styleRules)

const Comp = componentBuilder(buildRules);

const B = p => <Comp db {...p}/>
B.Col = p => <Comp flex flexColumn {...p}/>
B.Row = p => <Comp flex {...p}/>
B.I = p => <Comp di {...p}/>
B.Base = Comp

export default B
