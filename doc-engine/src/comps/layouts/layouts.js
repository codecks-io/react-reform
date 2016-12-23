import React from 'react'
import {B, col} from 'comps/styles'
import {Link as RRLink} from 'react-router'
import StickyBox from 'react-sticky-box'

export const RawButton = ({onClick, to, href, disabled, type = to || href ? undefined : 'button', props, ...rest}) => (
  <B component={to ? RRLink : href ? 'a' : 'button'} props={{onClick, type, to, href, disabled, ...props}} {...rest} cursor="pointer"/>
)
export const PlainLink = ({href, to, target, props, nofollow, ...rest}) => (
  <B.I component={to ? RRLink : 'a'} props={{...props, to, href, target, rel: nofollow ? 'nofollow' : undefined}} transitionProperty="color" {...rest}/>
)
export const Link = (props) => (
  <PlainLink blue b hover={{color: col.darkBlue}} {...props}/>
)

export const BigButton = (props) => (
  <RawButton {...props}/>
)

export const Input = (props) => (
  <input type="text" {...props}/>
)

export const Scaffold = ({children}) => (
  <B.Row minHeight="100vh">
    <B.Col ph4 pv4 flex="200px 1 0" bgHotPink paddingTop="11.7rem" alignItems="flex-end">
      <Nav/>
    </B.Col>
    <B.Row pb4 ph5 flex="800px 4 1" pt6 minWidth="1px">
      <B.Col width="100%" maxWidth="800px" mha>
        {children}
        <Footer/>
      </B.Col>
    </B.Row>
  </B.Row>
)

const NavLink = (props) => (
  <PlainLink white80 b mb4 tr f5 pr3 {...props}/>
)

export const Nav = () => (
  <StickyBox width={180}>
    <B.Col pt5>
      <NavLink to="/" white br bw2 b--white>Home</NavLink>
      <NavLink to="/getting-started/">Getting Started</NavLink>
      <NavLink to="/examples/">Examples</NavLink>
      <NavLink to="/docs/">Api Docs</NavLink>
    </B.Col>
  </StickyBox>
)

export const Footer = () => (
  <B black40 mta pt5 f6>React Reform is brought to you by <Link black60 href="https://www.codecks.io">Codecks</Link>.</B>
)

export const H1 = (props) => <B component="h1" f3 b black80 lh-title {...props}/>
export const SubH1 = (props) => <B f5 lh-title black60 mb5 {...props}/>

export const H2 = (props) => <B component="h2" f4 b black80 lh-title {...props}/>
export const H3 = (props) => <B component="h3" f5 b black80 lh-title {...props}/>

export const Section = (props) => <B component="section" mb6 {...props}/>
export const P = (props) => <B component="p" mb3 f5 black80 lh-copy {...props}/>

export const List = (props) => <B component="ul" mb4 {...props}/>
List.Item = (props) => <B component="li" display="list-item" mb2 lh-copy black80 {...props}/>

const stripLines = (text) => {
  const lines = text.split('\n')
  const minPad = lines
    .filter(line => /\S+/.test(line))
    .reduce((m, line) => Math.min(line.match(/^(\s*)/)[1].length, m), Infinity)
  return lines
    .map(line => /\S+/.test(line) ? line.slice(minPad) : line)
    .join('\n').trim()
}

export const Code = ({children: rawChildren, ...rest}) => {
  const children = typeof rawChildren === 'string' ? stripLines(rawChildren) : rawChildren
  return <B component="pre" {...rest} ph3 pv2 marginLeft="-1rem" marginRight="-1rem" bgBlack05 black70 f6 maxWidth="100%" overflowX="auto">{children}</B>
}

Code.Inline = (props) => <B.I component="code" ph1 bgBlack05 {...props}/>
