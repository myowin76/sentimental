class Admin::Survey < ActiveRecord::Base
	belongs_to :user
	has_many :client_surveys

	validates :name, presence: true
	# validates :question, presence: true
	# validates :url_token, uniqueness: true

	# before_create { generate_token(:url_token) }

	def self.search(search)
		if search
			where("text LIKE", "%#{search}")
		else
			find(:all)
		end	
	end
		

	# private
	
	def self.generate_token
	  begin
	    self[:url_token] = SecureRandom.urlsafe_base64
	  end while Admin::Survey.exists?(column => self[:url_token])
	end
end
