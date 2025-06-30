import { Separator } from '@renderer/components/ui/separator'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@renderer/components/ui/card'
import { StaffUser } from 'src/types/staff_users'
import { StaffManagementTable } from '@renderer/components/tables/staff_management/StaffManagementTable'
import { CreateStaffUserDialog } from '@renderer/dialog/CreateStaffUserDialog'

export default function StaffManagement(): React.JSX.Element {
  const [staffMembers, setStaffMembers] = useState<StaffUser[] | undefined>(undefined)

  useEffect(() => {
    function fetchStaffMembers(): void {
      window.db.listStaffUsers().then((_members) => {
        setStaffMembers(_members)
      })
    }
    fetchStaffMembers()
  }, [])

  return (
    <div className="p-4 pt-0">
      <div className="my-4">
        <h1 className="font-bold text-3xl text-center mb-4">Staff Management</h1>
        <Separator />
      </div>
      <Card>
        <CardContent>
          <div className="mb-2">
            <CreateStaffUserDialog />
          </div>
          {staffMembers && <StaffManagementTable staff_members={staffMembers} />}
        </CardContent>
      </Card>
    </div>
  )
}
