import React from 'react'

type Props = {
  allowedRoles: string[]
}

const PrivateRoute = ({ allowedRoles }: Props) => {
  return (
    <div>PrivateRoute</div>
  )
}

export default PrivateRoute