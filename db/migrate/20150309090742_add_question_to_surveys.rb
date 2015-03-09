class AddQuestionToSurveys < ActiveRecord::Migration
  def change
    add_column :surveys, :question, :text
  end
end
