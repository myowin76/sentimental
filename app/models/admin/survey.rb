class Admin::Survey < ActiveRecord::Base
	belongs_to :user
	has_many :client_surveys

	validates :name, presence: true
	validates :url_token, presence: true, uniqueness: true

	def self.search(search)
		if search
			where("text LIKE", "%#{search}")
		else
			find(:all)
		end	
	end
		

	private
	
	def generate_url(column)
	  begin
	    self[column] = SecureRandom.urlsafe_base64
	  end while Admin::Survey.exists?(column => self[column])
	end
end
