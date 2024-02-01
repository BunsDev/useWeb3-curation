import React, { ReactNode } from 'react'
import Image from 'next/image'
import { getLevelStyle, toTags } from 'utils/helpers'
import { Link } from './link'
import styles from './panel.module.scss'
import moment from 'moment'
import { Tags } from './tags'
import { Issue } from 'types/issue'

interface Props {
  children: ReactNode
  href?: string
  type?: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'info' | 'success' | 'warning' | 'error'
  fill?: boolean
  small?: boolean
  large?: boolean
  stretch?: boolean
  withIcons?: boolean
  className?: string
}

export function Panel(props: Props) {
  let containerClassName = styles.container
  if (props.className) containerClassName += ` ${props.className}`

  let className = `${styles[props.type ?? 'primary']}`
  if (props.href) className += ` ${styles.link}`
  if (props.fill) className += ` ${styles.fill}`
  if (props.small) className += ` ${styles.small}`
  if (props.withIcons) className += ` ${styles.icons}`
  if (props.large) className += ` ${styles.large}`
  if (props.stretch) className += ` ${styles.stretch}`

  if (props.href) {
    return (
      <div className={containerClassName}>
        <Link href={props.href} className={className}>
          <div className={styles.border}>{props.children}</div>
        </Link>
      </div>
    )
  }

  return (
    <div className={containerClassName}>
      <div className={className}>
        <div className={styles.border}>{props.children}</div>
      </div>
    </div>
  )
}

interface CardProps {
  title: string
  icon?: string
  description?: string
  url: string
  detailsUrl?: string
  tags: string[]
  level?: 'All' | 'Beginner' | 'Intermediate' | 'Advanced'
  className?: string
}

export function PanelCard(props: CardProps) {
  let className = `${styles.card}`
  if (props.className) className += ` ${props.className}`

  return (
    <Panel className={className} href={props.url} type={props.level ? getLevelStyle(props.level) : 'primary'} fill stretch>
      <div className={styles.inner}>
        <h4 className={styles.title}>
          {props.icon && <small>{props.icon}</small>} {props.title}
        </h4>

        {props.tags && props.tags.length > 0 && (
          <ul className={styles.tags}>
            {props.tags.map((i) => {
              return (
                <li key={i}>
                  <Panel className={styles.tag} href={`/tags/${i.toLowerCase()}`} type="neutral" small>
                    {i}
                  </Panel>
                </li>
              )
            })}
          </ul>
        )}

        <p className={`${styles.description} muted`}>{props.description}</p>

        {props.detailsUrl && (
          <p className={`${styles.details} muted`}>
            <Link href={props.detailsUrl}>more details &raquo;</Link>
          </p>
        )}
      </div>
    </Panel>
  )
}

interface IssueProps {
  issue: Issue
  className?: string
}

export function IssuePanel(props: IssueProps) {
  let className = `${styles.job}`
  if (props.className) className += ` ${props.className}`

  const tags: string[] = props.issue.labels
    .map((i) => i.name)
    .filter((i) => i.toLowerCase().includes('help wanted') || i.toLowerCase().includes('good first'))

  return (
    <Panel className={className} type="neutral" fill stretch>
      <div className={styles.inner}>
        <div className={styles.logo}>
          {/* <Image 
            src={props.issue.author.avatarUrl} 
            alt={props.issue.author.login} 
            height={64} 
            width={64} /> */}
          {/* // TODO: With more orgs/repos, replace author with repo images?*/}
          <Image src={props.issue.repository.owner.avatarUrl} alt={props.issue.repository.owner.login} height={64} width={64} />
        </div>
        <div className={styles.body}>
          <Link href={props.issue.url}>
            <h4>{props.issue.title}</h4>
          </Link>
          <div>
            <Link href={props.issue.repository.url}>{props.issue.repository.nameWithOwner}</Link>{' '}
            <span className="muted">
              <i className="bi bi-star"></i> {props.issue.repository.stargazerCount}
            </span>
          </div>
          <Tags
            className={styles.tags}
            small
            withIcons
            noLinks
            tags={toTags(tags)}
            addToList={
              props.issue.repository.primaryLanguage && (
                <li className={styles.primaryLanguage}>
                  <span className={styles.dot} style={{ backgroundColor: props.issue.repository.primaryLanguage.color }}>
                    &nbsp;
                  </span>
                  <span className="muted">{props.issue.repository.primaryLanguage.name}</span>
                </li>
              )
            }
          />
        </div>
        <div className={styles.stats}>
          <span className={styles.date + ' muted'}>
            {props.issue.author.login} <i className="bi bi-person"></i>
          </span>
          <span className={styles.date + ' muted'}>
            {moment(props.issue.createdAt).fromNow(false)} <i className="bi bi-clock"></i>
          </span>
          <span className={styles.date + ' muted'}>
            {props.issue.commentsCount} <i className="bi bi-chat-text"></i>
          </span>
        </div>
      </div>
    </Panel>
  )
}
