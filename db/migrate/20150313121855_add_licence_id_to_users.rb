class AddLicenceIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :licence_id, :integer
  end
end
