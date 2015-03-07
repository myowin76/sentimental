class ClientSurvey < ActiveRecord::Base
  belongs_to :survey, :class => 'Admin::Survey'
end
