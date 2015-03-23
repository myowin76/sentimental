class AddCompanyToSurvey < ActiveRecord::Migration
  def change
    add_column :surveys, :company, :string
  end
end
