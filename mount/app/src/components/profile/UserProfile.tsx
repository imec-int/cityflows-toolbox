import React from 'react'
import classnames from 'classnames'
import { Dropdown } from 'react-bootstrap'
import { CgProfile } from 'react-icons/cg'

import { FixedUIContainer } from '../mapControls/FixedUIContainer'
import { LanguageSelector } from './LanguageSelector'
import DropdownItem from 'react-bootstrap/DropdownItem'
import DropdownToggle from 'react-bootstrap/DropdownToggle'
import DropdownMenu from 'react-bootstrap/DropdownMenu'
import { LogoutBtn } from './LogoutBtn'

export const UserProfile: React.FC = () => {
  return (
    <FixedUIContainer
      className={classnames('w-[30px] h-[30px]', 'top-[11.8px] right-[285px]')}
    >
      <Dropdown
        drop={'start'}
        className={classnames(
          'w-full h-full',
          'flex justify-center items-center'
        )}
        autoClose={'outside'}
      >
        <DropdownToggle
          variant={'light'}
          className={classnames(
            'after:!hidden before:!hidden',
            'flex justify-center items-center',
            'border-0',
            'bg-transparent'
          )}
        >
          <CgProfile color={'grey'} size={18} />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <LanguageSelector drop={'start'} />
          </DropdownItem>
          <DropdownItem>
            <LogoutBtn />
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </FixedUIContainer>
  )
}
