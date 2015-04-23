class ClientSurvey < ActiveRecord::Base
  belongs_to :survey, :class => 'Admin::Survey'

  validates :text, presence: true



  def self.find_between fromdate, todate
    where(:created_at => fromdate .. todate)
  end

  def self.text_search(text)
  	where('text LIKE%', text)
  end
end
