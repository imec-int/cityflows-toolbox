import { useState } from 'react'
import { Nav, Tab } from 'react-bootstrap'

import { ContentItem, SelectableContentItem } from '../../store/CFState'

interface ContentItemTabsProps {
  contentItem: SelectableContentItem
  keyPrefix: string
  renderContent: (contentItem: ContentItem, key: string) => any
}

export function SelectableItemTabs({
  contentItem,
  keyPrefix,
  renderContent,
}: ContentItemTabsProps) {
  const [activeKey, setActiveKey] = useState<string>(keyPrefix + '0')
  return (
    <Tab.Container
      id={keyPrefix + 'selectable'}
      defaultActiveKey={activeKey}
      onSelect={(eventKey) => setActiveKey(eventKey as string)}
    >
      <Nav variant="pills">
        {contentItem.children?.map(function (child, childCounter) {
          return (
            <Nav.Item key={'tabSelector' + keyPrefix + childCounter}>
              <Nav.Link eventKey={'tab' + keyPrefix + childCounter}>
                {child.label}
              </Nav.Link>
            </Nav.Item>
          )
        })}
      </Nav>
      <Tab.Content>
        {contentItem.children?.map(function (child, childCounter) {
          const eventKey = 'tab' + keyPrefix + childCounter
          const isActive = eventKey === activeKey
          return isActive ? (
            <Tab.Pane key={eventKey} eventKey={eventKey}>
              {activeKey === eventKey
                ? renderContent(child.item, keyPrefix + '_' + childCounter)
                : null}
            </Tab.Pane>
          ) : null
        })}
      </Tab.Content>
    </Tab.Container>
  )
}
